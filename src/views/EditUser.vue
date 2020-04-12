<template>
  <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
    <el-form-item>
      <el-input type="hidden" autocomplete="off" v-model="ruleForm1.id"></el-input>
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="ruleForm1.name"></el-input>
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input type="number" v-model="ruleForm1.age"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <el-input v-model="ruleForm1.gender"></el-input>
    </el-form-item>
    <el-form-item>
      <div class="bottom">
        <el-button @click="resetForm('ruleForm1')">重 置</el-button>
        <el-button type="primary" @click="updateUser()">确 定</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>

export default {
  name: 'EditUser',
  data () {
    return {
      ruleForm1: {
        id: '',
        name: '',
        age: 0,
        gender: ''
      },
      rules1: {
        name: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 5,
            message: '长度在 2 到 5 个字符',
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
      }
    }
  },
  // props: ['uid'],
  methods: {
    init (id) {
      console.log('init()>>>' + id)
      this.$axios.get('http://localhost:8081/getUserById/' + id
        // this.$qs.stringify({
        //   id: id
        // })
      ).then(d => {
        this.ruleForm1.id = d.data.result.id
        this.ruleForm1.name = d.data.result.name
        this.ruleForm1.age = d.data.result.age
        this.ruleForm1.gender = d.data.result.gender
      })
    },
    resetForm (ruleForm1) {
      this.$refs[ruleForm1].resetFields()
    },
    updateUser () {
      // alert('submit')
      this.$axios.post('http://localhost:8081/updateUser',
        this.$qs.stringify({
          id: this.ruleForm1.id,
          name: this.ruleForm1.name,
          age: this.ruleForm1.age,
          gender: this.ruleForm1.gender
        })).then(d => {
        if (d.data.code === 0) {
        // 关闭dialog 刷新父页面 element dialog 是自动关闭的 是因为父页面的 addDialogVisible 重置为false
          parent.location.reload()
        } else {
          this.$message(d.data.msg)
        }
        // this.$message(d.data.msg)
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
