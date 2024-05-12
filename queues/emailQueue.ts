import { Worker } from "bullmq";
import dotenv from "dotenv";
dotenv.config();

const redisPort = process.env.redisport ? parseInt(process.env.redisport) : undefined;


interface SendEmailPayload {
    from:string;
    to:string;
    subject:string;
    body:string;
}

async function sendEmail(payload:SendEmailPayload){
    const {from,to,subject,body} = payload;
    return new Promise((resolve,reject)=>{      
        console.log(`Sending email from ${from} to ${to} with subject ${subject} and body ${body}`);
        setTimeout(() => {
            resolve(1);
        }, 2*1000);
    })
}

export const emailWorker = new Worker("email-queue", async (job:any) => {

  console.log(job.data);

  const email = sendEmail({
        from:job.data.from,
        to:job.data.to,
        subject:job.data.subject,
        body:job.data.body
  })
},{
    connection:{
        host:process.env.host,
        port:redisPort,
        username:process.env.username,
        password:process.env.password
    },concurrency:10
});
