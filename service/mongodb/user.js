var User = require("./userModel.js");

var userMethods = {
/**
 * 插入数据
 */
insert:function(data,callback) {
 
    // var user = new User({
    //     username : 'Tracy McGrady',                 //用户账号
    //     userpwd: 'abcd',                            //密码
    //     logindate : new Date()                      //最近登录时间
    // });

    var user = new User(data);

    user.save(function (err, res) {

        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + JSON.stringify(res));
            callback(res)
        }

    });
},

/**
 * 修改数据
 */

update:function(oldData,newData,callback){
    // var wherestr = {'username' : 'Tracy McGrady'};
    // var updatestr = {'userpwd': 'zzzz'};

    var wherestr = oldData;
    var updatestr = newData;
    
    User.update(wherestr, updatestr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + JSON.stringify(res));
            callback(res)
        }
    })
}
,
/**
 * 删除数据
 */

del:function(data){
    //var wherestr = {'username' : 'Tracy McGrady'};
    var wherestr = data;
    
    User.remove(wherestr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + JSON.stringify(res));
            callback(res)
        }
    })
},

/**
 * 条件查询
 */

getByConditions:function(data,callback){
    var wherestr = data;
    
    User.find(wherestr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
            callback(res)
        }
    })
},

/**
 * 数量查询
 */

getCountByConditions:function(){
    var wherestr = {};
    
    User.count(wherestr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })
},

/**
 * ID查询
 */

getById:function(){
    var id = '56f261fb448779caa359cb73';
    
    User.findById(id, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })
},

/**
 * 模糊查询
 */

getByRegex:function(){
    var whereStr = {'username':{$regex:/m/i}};
    
    User.find(whereStr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })
},

/**
 * 分页
 */

getByPager:function(){
    
    var pageSize = 5;                   //一页多少条
    var currentPage = 1;                //当前第几页
    var sort = {'logindate':-1};        //排序（按登录时间倒序）
    var condition = {};                 //条件
    var skipnum = (currentPage - 1) * pageSize;   //跳过数
    
    User.find(condition).skip(skipnum).limit(pageSize).sort(sort).exec(function (err, res) {
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })
}
}

module.exports = userMethods