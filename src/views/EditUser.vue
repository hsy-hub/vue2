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
      <!--<el-radio v-model="radio" label="1">男</el-radio>-->
      <!--<el-radio v-model="radio" label="2">女</el-radio>-->
    </el-form-item>
    <el-form-item label="照片" prop="imagePath">
      <el-upload action="http://localhost:8081/imagesUpload"
                 list-type="picture-card"
                 :on-preview="handlerPictureCardPreview1"
                 :on-success="handlerUploadSuccess1"
                 :file-list="fileList"
                 multiple
                 ref="edit"
                 :auto-upload="false"
                 :on-remove="handlerRemove1">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible1">
        <img width="100%" :src="dialogImageUrl1" alt="">
      </el-dialog>
    </el-form-item>
    <el-form-item>
      <div class="bottom">
        <el-button @click="resetForm('ruleForm1')">重 置</el-button>
        <el-button type="primary" @click="updateUser('ruleForm1')">确 定</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>

import * as qs from 'qs'

export default {
  name: 'EditUser',
  data () {
    return {
      ruleForm1: {
        id: '',
        name: '',
        age: 0,
        gender: '',
        imagePath: ''
        // radio: '1'
      },
      rules1: {
        name: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 30,
            message: '长度在 2 到 30 个字符',
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
      dialogVisible1: false,
      dialogImageUrl1: '',
      uploadSuccessFileCount: 0,
      fileList: [{ name: '1.jpg', url: 'http://localhost:8081/upload/' }]
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
        this.fileList = []
        const pathArr = (d.data.imagePath || '').split(',')
        for (let i = 0; i < pathArr.length; i++) {
          const file = { name: i, url: 'http://localhost:8081/upload/' + pathArr[i] }
          this.fileList.push(file)
        }
        console.log(d.data.imagePath)
        this.ruleForm1.id = d.data.result.id
        this.ruleForm1.name = d.data.result.name
        this.ruleForm1.age = d.data.result.age
        this.ruleForm1.gender = d.data.result.gender
      })
    },
    handlerRemove1 (file, fileList) {
      console.log(file, fileList)
    },
    handlerPictureCardPreview1 (file) {
      this.dialogImageUrl1 = file.url
      console.log(this.dialogImageUrl1)
      this.dialogVisible1 = true
    },
    resetForm (ruleForm1) {
      this.$refs[ruleForm1].resetFields()
    },
    handlerUploadSuccess1 (reponse, file, fileList) {
      var params = this.ruleForm1
      var filecount = this.$refs.edit.uploadFiles.length
      this.uploadSuccessFileCount++
      if (this.uploadSuccessFileCount === 1) {
        this.ruleForm1.imagePath = reponse
      } else {
        this.ruleForm1.imagePath = this.ruleForm1.imagePath + ',' + reponse
      }
      if (filecount === this.uploadSuccessFileCount) {
        this.$axios({
          method: 'post',
          url: 'http://localhost:8081/updateUser',
          data: params,
          transformRequest: [function (data) {
            return qs.stringify(data)
          }]
        }
        ).then(d => {
          if (d.data.code === 0) {
            // 关闭dialog 刷新父页面 element dialog 是自动关闭的 是因为父页面的 addDialogVisible 重置为false
            parent.location.reload()
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }
        })
      }
    },
    updateUser (ruleForm1) {
      this.$refs[ruleForm1].validate((valid) => {
        if (valid) {
          this.$refs.edit.submit()
        }
        // else {
        //   this.$message({
        //     message: '修改失败',
        //     type: 'warning'
        //   })
        //   return false
        // }
      })
      // alert('submit')
      // this.$axios.post('http://localhost:8081/updateUser',
      //   this.$qs.stringify({
      //     id: this.ruleForm1.id,
      //     name: this.ruleForm1.name,
      //     age: this.ruleForm1.age,
      //     gender: this.ruleForm1.gender
      //   })).then(d => {
      //   if (d.data.code === 0) {
      //   // 关闭dialog 刷新父页面 element dialog 是自动关闭的 是因为父页面的 addDialogVisible 重置为false
      //     parent.location.reload()
      //   } else {
      //     this.$message(d.data.msg)
      //   }
      //   // this.$message(d.data.msg)
      // })
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
