<template>
  <div class="div">
    <h2>学生管理系统</h2>
    <h3>用户登录</h3>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      ruleForm: {
        name: '',
        password: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入登录名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请填密码',
            trigger: 'blur'
          }
        ]
      },
      token: ''
    }
  },
  methods: {
    ...mapMutations(['changeLogin']),
    submitForm () {
      // console.log(this.ruleForm.name)
      // console.log(this.ruleForm.password)
      this.$axios.post('http://localhost:8081/login',
        {
          name: this.ruleForm.name,
          password: this.ruleForm.password
        }, { emulateJSON: true }).then(d => {
        // console.log(d.data)
        // 将用户token保存到vuex中
        this.token = 'Bearer ' + d.data.token
        this.changeLogin({ Authorization: this.token })
        if (d.data.code === 1) {
          // localStorage.setItem('token', JSON.stringify(d.data.token))
          // 路由的跳转this.$router.push("新路由的地址")
          localStorage.setItem('user', JSON.stringify(d.data.data))
          this.$router.push('/container')
          this.$message({
            message: '登录成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '登录失败',
            type: 'error'
          })
        }
      })
      //   var t = this
      //   this.$refs[formName].validate((valid) => {
      //     if (valid) {
      //       console.log('>>>>>' + t.ruleForm.name)
      //       console.log('<<<<<' + t.ruleForm.password)
      //       this.$http.post('http://localhost:8000/login', {
      //         name: t.ruleForm.name,
      //         password: t.ruleForm.password
      //       }, { emuLateJSON: true }).then(d => {
      //         if (d.data.code === 0) {
      //           // 路由的跳转this.$router.push("新路由的地址")
      //           this.$router.push('/mainPage')
      //         }
      //         this.$message(d.data.message)
      //       })
      //     } else {
      //       console.log('error submit!!')
      //       return false
      //     }
      //   })
      // },
      // resetForm (formName) {
      //  this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

  .div {
    margin: 0 auto;
    width: 300px;
    height: 200px;
    border-color: #000;
    border-width: 1px
  }
</style>
