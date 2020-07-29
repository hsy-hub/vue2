<template>
  <el-form :model="ruleForm3" :rules="rules3" ref="ruleForm3" label-width="100px" class="demo-ruleForm">
    <el-form-item>
      <el-input type="hidden" autocomplete="off" v-model="ruleForm3.id"></el-input>
    </el-form-item>
    <el-form-item label="原密码" prop="oldPassword">
      <el-input type="number" v-model="ruleForm3.oldPassword"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input type="number" v-model="ruleForm3.newPassword"></el-input>
    </el-form-item>
    <!--<el-form-item label="确认密码" prop="newPassword2">-->
      <!--<el-input type="number" v-model="ruleForm3.newPassword2"></el-input>-->
    <!--</el-form-item>-->
    <el-form-item>
      <div class="bottom">
        <el-button @click="resetForm('ruleForm3')">重 置</el-button>
        <el-button type="primary" @click="updatePwd('ruleForm3')">确 定</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import * as qs from 'qs'

export default {
  name: 'UpdatePwd',
  data () {
    // 此处添加表单发送之前的验证

    // 声明validateNewPassword变量验证首次输入的新密码
    var validateNewPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else if (value.toString().length < 6 || value.toString().length > 18) {
        callback(new Error('密码长度为6-18位'))
      } else {
        callback()
      }
    }
    // 声明validateNewPassword2验证再次输入的新密码，并与首次输入的新密码做比较
    // var validateNewPassword2 = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请再次输入密码'))
    //   } else if (value !== this.ruleForm3.NewPassword) {
    //     callback(new Error('两次输入密码不一致!'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      ruleForm3: {
        id: '',
        oldPassword: '',
        newPassword: ''
        // newPassword2: ''
      },
      rules3: {
        // 验证旧密码
        oldPassword: [{
          min: 2,
          max: 6,
          message: '长度在 3 到 6 个字符',
          trigger: 'blur'
        }],
        // 验证新密码
        newPassword: [{
          required: true,
          validator: validateNewPassword,
          trigger: 'blur'
        }]
        // 验证再次输入的新密码
        // NewPassword2: [{
        //   required: true,
        //   validator: validateNewPassword2,
        //   trigger: 'blur'
        // }]

      },
      id: '',
      oldPassword: '',
      newPassword: ''
      // newPassword2: ''
    }
  },
  methods: {
    init () {
      this.ruleForm3.oldPassword = JSON.parse(localStorage.getItem('user')).password
    },
    resetForm (ruleForm3) {
      this.$refs[ruleForm3].resetFields()
    },
    updatePwd (ruleForm3) {
      // console.log(JSON.parse(localStorage.getItem('user')))
      var id = JSON.parse(localStorage.getItem('user')).id
      // console.log(JSON.parse(localStorage.getItem('user')).password)
      // console.log(this.ruleForm3)
      this.$refs[ruleForm3].validate((valid) => {
        if (valid) {
          this.$axios({
            url: 'http://localhost:8081/updatePwd',
            method: 'post',
            contentType: 'application/json',
            data: {
              id: id,
              password: this.ruleForm3.newPassword
              // newPassword2: this.ruleForm3.newPassword2
            },
            transformRequest: [function (data) {
              return qs.stringify(data)
            }]
          }
          ).then((res) => {
            if (res.status === 200) {
              // res.data.code === 0 这种方式也可以
              // console.log(res)
              // res打印结果 {data: {…},status:200,statusText:"",headers:{…},config:{…},…}
              this.$notify({
                title: '修改成功',
                message: '您的账户密码已修改成功,5秒后跳转到登录页',
                type: 'success'
              })
              setTimeout(() => {
                this.$router.push('/')// 修改成功以后跳转到登录页
              }, 5000)
            } else {
              // console.log('__________')
              this.$notify.warning({
                title: '修改失败',
                message: '您的密码修改失败，请重新输入'
              })
            }
          })
        } else {
          return false
        }
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
