// KHÔI PHỤC ảnh nhúng (undo của đợt chuyển ảnh ra tệp 2026-10-13).
// Cách dùng: đăng nhập quản trị trên trang, mở Console (F12), dán toàn bộ tệp này rồi Enter.
// Có thể chạy cho 1 đề: await RESTORE(['test_xxx']) ; mặc định khôi phục mọi đề trong manifest.
(async()=>{
const M=await (await fetch('/backup/mt-image-migration-2026-10-13/manifest.json',{cache:'no-store'})).json();
const o=CloudDB.db.app.options;const BASE='https://firestore.googleapis.com/v1/projects/'+o.projectId+'/databases/(default)/documents/tests/';const KEY=o.apiKey;
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join('');
const b64=u=>{let b='';for(let i=0;i<u.length;i+=32768)b+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(b)};
const walk=(v,fn)=>{if(!v)return;if(v.stringValue!==undefined)return fn(v);if(v.arrayValue)(v.arrayValue.values||[]).forEach(x=>walk(x,fn));if(v.mapValue)Object.values(v.mapValue.fields||{}).forEach(x=>walk(x,fn))};
window.RESTORE=async(ids)=>{ids=ids||Object.keys(M.docs);const out=[];for(const id of ids){try{
const cur=await (await fetch(BASE+id+'?key='+KEY,{cache:'no-store'})).json();const qv=JSON.parse(JSON.stringify(cur.fields.questions));const nodes=[];walk(qv,v=>{if(/^images\/mt_[0-9a-f]{16}\.\w+$/.test(v.stringValue))nodes.push(v)});let n=0;
for(const v of nodes){const m=M.images[v.stringValue];if(!m)throw new Error('khong co trong manifest: '+v.stringValue);const r=await fetch('/'+v.stringValue+'?v='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error('thieu tep '+v.stringValue);const s='data:'+m.mime+';base64,'+b64(new Uint8Array(await r.arrayBuffer()));if(await sha(s)!==m.origDataUrlSha256)throw new Error('sai ma bam '+v.stringValue);v.stringValue=s;n++}
if(!n){out.push(id+': khong co anh de khoi phuc');continue}
const tok=await CloudDB.auth.currentUser.getIdToken();const w=await fetch(BASE+id+'?updateMask.fieldPaths=questions&currentDocument.updateTime='+encodeURIComponent(cur.updateTime),{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok},body:JSON.stringify({fields:{questions:qv}})});
out.push(id+': '+(w.ok?'da khoi phuc '+n+' anh':'LOI '+w.status))}catch(e){out.push(id+': LOI '+e.message)}}
console.log(out.join('\n'));return out};
console.log('San sang. Chay: await RESTORE()  (tat ca)  hoac  await RESTORE([\'test_xxx\'])');
})();
