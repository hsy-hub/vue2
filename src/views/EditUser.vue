<template>
  <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
    <el-form-item>
      <el-input type="hidden" autocomplete="off" v-model="ruleForm1.id"></el-input>
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="ruleForm1.name" type="text"></el-input>
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input type="number" v-model="ruleForm1.age"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <el-radio-group v-model="ruleForm1.gender" size="medium">
        <el-radio border label="男"></el-radio>
        <el-radio border label="女"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="专业" prop="majorName">
    <el-select v-model="ruleForm1.m_id" placeholder="请选择专业">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    </el-form-item>
    <el-form-item label="班级" prop="className">
      <el-select v-model="ruleForm1.cl_id" placeholder="请选择班级">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="上传图片" prop="imagePath">
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

// import * as axios from 'axios'

export default {
  name: 'EditUser',
  data () {
    return {
      options: [{ value: '', lable: '' }],
      options1: [{ value: '', lable: '' }],
      m_id: '',
      cl_id: '',
      value: '',
      fileList: [],
      ruleForm1: {
        // 让数据可以填入
        id: '',
        name: '',
        age: 0,
        gender: '',
        m_id: '',
        cl_id: '',
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
      uploadSuccessFileCount: 0
    }
  },
  mounted () {
    this.getMajor()
    this.getClass()
  },
  methods: {
    getMajor () {
      this.$axios.get('http://localhost:8081/getMajorList')
        .then(d => {
          this.options = []
          var res = d.data.data
          // console.log(res)
          for (let i = 0; i < res.length; i++) {
            var list = {
              value: i,
              label: res[i].majorName
            }
            this.options.push(list)
          }
        })
    },
    getClass () {
      this.$axios.get('http://localhost:8081/getClassList')
        .then(d => {
          this.options1 = []
          var ree = d.data.data
          // console.log(ree)
          for (let i = 0; i < ree.length; i++) {
            var list1 = {
              value: i,
              label: ree[i].className
            }
            this.options1.push(list1)
          }
        })
    },
    init (id) {
      // console.log('init()>>>' + id)
      this.$axios.get('http://localhost:8081/getUserById/' + id
      ).then(d => {
        this.fileList = []
        var pathArr = ''
        for (let i = 0; i < d.data.data.length; i++) {
          pathArr = (d.data.data[i].imagePath || '').split(',')
        }
        // const pathArr = (d.data.data.imagePath || '').split(',')
        for (let i = 0; i < pathArr.length; i++) {
          const file = { name: i, url: 'http://localhost:8081/upload/' + pathArr[i] }
          this.fileList.push(file)
        }
        var res1 = d.data.data
        // console.log('res1>>>>' + d.data.data)
        for (let i = 0; i < res1.length; i++) {
          this.ruleForm1.id = res1[i].id
          this.ruleForm1.name = res1[i].name
          this.ruleForm1.age = res1[i].age
          this.ruleForm1.gender = res1[i].gender
          this.ruleForm1.m_id = res1[i].major.id
          this.ruleForm1.cl_id = res1[i].class_.id
          // this.ruleForm1.imagePath = res1[i].imagePath
        }
      })
    },
    handlerRemove1 (file, fileList) {
      console.log(file, fileList)
    },
    handlerPictureCardPreview1 (file) {
      this.dialogVisible1 = true
      this.dialogImageUrl1 = file.url
      // console.log(this.dialogImageUrl1)
    },
    resetForm (ruleForm1) {
      this.$refs[ruleForm1].resetFields()
    },
    handlerUploadSuccess1: function (reponse, file, fileList) {
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
          // this.$axios.post('http://localhost:8081/updateUser',
          // this.$qs.stringify({
          //   id: this.ruleForm1.id,
          //   name: this.ruleForm1.name,
          //   age: this.ruleForm1.age,
          //   gender: this.ruleForm1.gender,
          //   majorName: this.ruleForm1.majorName,
          //   className: this.ruleForm1.className
          // })
          // ).then(d => {
          //   if (d.data.code === 0) {
          //     // 关闭dialog 刷新父页面 element dialog 是自动关闭的 是因为父页面的 addDialogVisible 重置为false
          //     parent.location.reload()
          //   } else {
          //     this.$message(d.data.msg)
          //   }
          //   // this.$message(d.data.msg)
          // })
        } else {
          this.$message({
            message: '修改失败',
            type: 'warning'
          })
          return false
        }
      })
      // alert('submit')
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
