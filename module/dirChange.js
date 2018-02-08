/**
 * Created by sc on 2018/2/4.
 */

const fs = require('fs');
const path = require('path');
const ObjectId = require('mongodb').ObjectId;


const formidable = require('formidable');
const  util = require('util');
const timestamp = require('time-stamp');

const db = require('../module/db.js');
const paramCheck = require('../module/paramCheck.js');
const logDatabase = "logInfo";          //登陆注册数据库名
const questionDatabase = "questions";          //提问数据库名

/**
 * 更改图片路径与名称
 * @param req
 * @param res
 * @param callback
 */

let images = [];   //存放图片名称的数组
function formHandle(req,res,callback) {

    let form = new formidable.IncomingForm();

    let upPath = path.normalize('C:\\Users\\sc\\Desktop\\毕业设计\\Q-A-images');  //路径矫正
    form.uploadDir = upPath;   //设置缓存路径
    form.multiples = true;    //设置多文件上传
    // form.keepExtensions = true;   //设置保留文件后缀,取消此项设置，因为要重命名

    form.parse(req, function(err, fields, files) {

        let paramCorrect = paramCheck.questionParam(fields);  //// 键是否正确判断
        if(!paramCorrect){
            callback(new Error("提问表单属性出错"));
            return;
        }

        let userId = fields.user_id.toString().trim();
        let content = fields.content.toString().trim();      //应由前端来做判断


        if(files.hasOwnProperty("img") && files.hasOwnProperty("File") ){   //若存在字段名为“img”,则表示有图片被上传
            reNameImage(files,upPath);
        }else{                      //没有图片没上传

        }

        // if(userId.length !== 24){
        //     callback(new Error("user_id位数错误!"));
        //     return;
        // }
        db.findDocument('Q&A',logDatabase,{"_id":ObjectId(userId)},{page:0,size:0},(err,data) => {

            if(err){
                images = [];   //清空
                callback(new Error("提问环节,数据库查找失败!"));
                return;
            }else if(data.length == 0){   //用户不存在，不可提问
                images = [];   //清空
                callback(new Error("用户不存在，不可提问"));
                return;
            }else{              //注册
                db.insertDocument('Q&A',questionDatabase,[{"user_id":userId,"content":content,"img":images.toString()}],(err,data) => {
                    if(err){
                        images = [];   //清空
                        callback(new Error("提问环节,数据库插入失败!"));
                        return;
                    }else{
                        //成功写入数据库
                        images = [];   //清空
                        callback();
                        return;
                    }
                })
            }
        });


    });


}

function reNameImage(files,upPath) {
    if(Array.isArray(files.img)){
        for (let image of files.img) {     //多图片上传
            let time = timestamp('YYYYMMDDHHmmssms').toString();  //时间戳，精确到毫秒
            let rand = Math.floor(Math.random()*89999+10000);   //5位随机数
            let extname = path.extname(image.name);         //获取后缀名
            let oldPath = image.path;
            let newName = time+rand+extname;
            let newPath = path.join(upPath,newName);

            fs.renameSync(oldPath,newPath);              //同步上传
            images.push(newName);
        }
    }else{                                        //单图片上传
        let time = timestamp('YYYYMMDDHHmmssms').toString();  //时间戳，精确到毫秒
        let rand = Math.floor(Math.random()*89999+10000);   //5位随机数
        let extname = path.extname(files.img.name);         //获取后缀名
        let oldPath = files.img.path;
        let newName = time+rand+extname;
        let newPath = path.join(upPath,newName);

        fs.renameSync(oldPath,newPath);              //同步上传
        images.push(newName);
    }

}
module.exports = {formHandle};