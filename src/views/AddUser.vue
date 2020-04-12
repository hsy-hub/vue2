<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input type="number" v-model="ruleForm.age"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-input v-model="ruleForm.gender"></el-input>
      </el-form-item>
      <el-form-item>
      <div class="bottom">
        <el-button @click="resetForm('ruleForm')">重 置</el-button>
        <el-button type="primary" @click="addUser('ruleForm')">确 定</el-button>
      </div>
      </el-form-item>
        </el-form>
</template>

<script>
export default {
  name: 'AddUser',
  data () {
    return {
      ruleForm: {
        name: '',
        password: '',
        age: 0,
        gender: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请填密码',
            trigger: 'blur'
          }
        ],
        age: [
          {
            required: true,
            message: '请填年龄',
            trigger: 'blur'
          }
        ],
        gender: [
          {
            required: true,
            message: '请填性别',
            trigger: 'blur'
          }
        ]
      },
      addDialogVisible: false
    }
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    addUser (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit')
          this.$axios.post('http://localhost:8081/addUser',
            this.$qs.stringify({
              name: this.ruleForm.name,
              password: this.ruleForm.password,
              age: this.ruleForm.age,
              gender: this.ruleForm.gender
            })).then(d => {
            if (d.data === 1) {
              // 关闭dialog 刷新父页面 element dialog 是自动关闭的 是因为父页面的 addDialogVisible 重置为false
              parent.location.reload()
            }
          })
        } else {
          console.log('error submit')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.bottom{
  text-align: end;
  width: 100%;
}
</style>
