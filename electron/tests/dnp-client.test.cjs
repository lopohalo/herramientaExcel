const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createDnpClient,parseDnpResponse}=require('../dnp-client');
const home=()=>({ok:true,headers:{getSetCookie:()=>['session=test; Path=/; HttpOnly']},text:async()=>"var _ruiPubNonce='test-nonce';"});
const json=(data)=>({ok:true,text:async()=>JSON.stringify(data)});
test('rechaza HTML y respuestas sin contrato en lugar de no registra',()=>{
 for(const body of ['<html>Error</html>','{}','null','{"ok":true}']) assert.throws(()=>parseDnpResponse(body,'SISBÉN'));
 assert.deepEqual(parseDnpResponse('{"ok":false}','SISBÉN'),{ok:false});
 assert.throws(()=>parseDnpResponse('{"ok":false,"message":"Servicio no disponible"}','SISBÉN'));
});
test('ambos POST envían el mismo formulario, nonce y cookie de una sesión compartida',async()=>{
 const calls=[];const client=createDnpClient(async(url,options)=>{calls.push({url,options});return options.method==='POST'?json({ok:true,grupo:'A1'}):home();});
 await Promise.all([client.consultarGrupoSisben('00000000',3),client.obtenerDatosRui('00000000',3)]);
 assert.equal(calls.length,3);
 assert.equal(calls[0].url,'https://ventanillasocial.dnp.gov.co/');
 assert.deepEqual(calls.slice(1).map(c=>new URL(c.url).pathname).sort(),['/Home/ConsultarGrupoSisben','/Home/ObtenerDatosRUI']);
 for(const {url,options} of calls.slice(1)){
  assert.equal(new URL(url).search,'');
  assert.equal(options.body,'pNumDoc=00000000&pTipDoc=3');
  assert.equal(options.method,'POST');
  assert.equal(options.headers['Content-Type'],'application/x-www-form-urlencoded');
  assert.equal(options.headers['X-Rui-Nonce'],'test-nonce');
  assert.equal(options.headers.Cookie,'session=test');
 }
});
test('informa HTTP y desconexión sin convertirlos en no registra',async()=>{
 await assert.rejects(createDnpClient(async(_url,options)=>options.method==='POST'?{ok:false,status:503}:home()).consultarGrupoSisben('0',3),/HTTP 503/);
 await assert.rejects(createDnpClient(async()=>{throw new Error('offline');}).consultarGrupoSisben('0',3),/offline/);
});
test('no consulta sin nonce y reabre sesión al reintentar',async()=>{
 let attempts=0;let posts=0;
 const client=createDnpClient(async(_url,options)=>{
  if(options.method==='POST'){posts++;return json({ok:false});}
  attempts++;return attempts===1?{ok:true,text:async()=>'<html></html>'}:home();
 });
 await assert.rejects(client.consultarGrupoSisben('0',3),/identificador de sesión/);
 assert.equal(posts,0);
 await client.consultarGrupoSisben('0',3);assert.equal(posts,1);assert.equal(attempts,2);
});
test('agota espera aunque el transporte no resuelva',async()=>{
 await assert.rejects(createDnpClient(()=>new Promise(()=>{}),{timeoutMs:10}).consultarGrupoSisben('0',3),/tiempo de espera/);
});
test('conserva el motivo real del rechazo y oculta documentos',()=>{
 assert.throws(()=>parseDnpResponse('{"ok":false,"msg":"Acceso denegado para 123456789"}','SISBÉN'),error=>error.message.includes('Acceso denegado') && !error.message.includes('123456789'));
});
