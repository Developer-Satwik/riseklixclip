import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Readable} from 'node:stream';
import {createEnquiryHandler} from '../server/campaign-enquiry.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),publicRoot=fs.realpathSync(path.join(root,'public')),envFile=path.join(root,'.env.local');
if(fs.existsSync(envFile))process.loadEnvFile(envFile);
const handle=createEnquiryHandler(),port=8770;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,`http://127.0.0.1:${port}`),pathname=decodeURIComponent(url.pathname);
  if(pathname==='/api/campaign-enquiry'){
   const request=new Request(url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Readable.toWeb(req),duplex:'half'}:{})});
   const response=await handle(request,{clientAddress:req.socket.remoteAddress});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;
  }
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end('Method not allowed');return;}
  if(pathname.includes('\0')||pathname.includes('\\'))throw Error();
  const candidate=path.resolve(publicRoot,'.'+pathname),relative=path.relative(publicRoot,candidate);
  if(relative.startsWith('..')||path.isAbsolute(relative))throw Error();
  const stat=await fs.promises.stat(candidate),file=await fs.promises.realpath(stat.isDirectory()?path.join(candidate,'index.html'):candidate);
  if(!file.startsWith(publicRoot+path.sep)||!(await fs.promises.stat(file)).isFile())throw Error();
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','X-Frame-Options':'SAMEORIGIN','Referrer-Policy':'strict-origin-when-cross-origin'});
  if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
 }catch{if(!res.headersSent)res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`RiseKlix local preview: http://127.0.0.1:${port}/\nCampaign email configuration: ${process.env.RESEND_API_KEY?'key present (not sent or verified)':'key absent; email/Discord fallback available'}`));
