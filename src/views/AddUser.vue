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
      <el-form-item label="上传图片">
        <el-upload action="http://localhost:8081/imagesUpload"
                   list-type="picture-card"
                   :on-preview="handlerPictureCardPreview"
                   :on-success="handlerUploadSuccess"
                   multiple
                   ref="upload"
                   :auto-upload="false"
                   :on-remove="handlerRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
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
import * as qs from 'qs'

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
      addDialogVisible: false,
      dialogVisible: false,
      dialogImageUrl: '',
      uploadSuccessFileCount: 0
    }
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    addUser (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit()
          // alert('submit')
          // this.$axios.post('http://localhost:8081/addUser',
          //   this.$qs.stringify({
          //     name: this.ruleForm.name,
          //     password: this.ruleForm.password,
          //     age: this.ruleForm.age,
          //     gender: this.ruleForm.gender
          //   })).then(d => {
          //   if (d.data === 1) {
          //     // 关闭dialog 刷新父页面 element dialog 是自动关闭的 是因为父页面的 addDialogVisible 重置为false
          //     parent.location.reload()
          //   }
          // })
        } else {
          this.$message({
            message: '添加失败',
            type: 'warning'
          })
          return false
        }
      })
    },
    handlerRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlerPictureCardPreview (file) {
      this.dialogImageUrl = file.url
      console.log(this.dialogImageUrl)
      this.dialogVisible = true
    },
    handlerUploadSuccess (reponse, file, fileList) {
      var params = this.ruleForm
      var filecount = this.$refs.upload.uploadFiles.length
      this.uploadSuccessFileCount++
      if (this.uploadSuccessFileCount === 1) {
        this.ruleForm.imagePath = reponse
      } else {
        this.ruleForm.imagePath = this.ruleForm.imagePath + ',' + reponse
      }
      if (filecount === this.uploadSuccessFileCount) {
        this.$axios({
          method: 'post',
          url: 'http://localhost:8081/addUser',
          data: params,
          transformRequest: [function (data) {
            return qs.stringify(data)
          }]
        }
        ).then(d => {
          if (d.data === 1) {
          // 关闭dialog 刷新父页面 element dialog 是自动关闭的 是因为父页面的 addDialogVisible 重置为false
            parent.location.reload()
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          }
        })
      }
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
