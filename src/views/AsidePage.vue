<template>
<div>
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-openeds="['1', '3']">
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-message"></i>管理页面</template>
        <el-menu-item-group>
          <!--<template slot="title">分组一</template>-->
          <el-menu-item :hidden="a" index="1-1" @click="goto('/container/userList')">学生管理</el-menu-item>
          <el-menu-item :hidden="b" index="1-2" @click="goto('/container/userList1')">用户管理</el-menu-item>
          <el-menu-item :hidden="c" index="1-3" @click="goto('/container/courseList')">课程管理</el-menu-item>
          <el-menu-item :hidden="d" index="1-4" @click="goto('/container/gradePage')">成绩管理</el-menu-item>
          <el-menu-item index="1-5" @click="goto('/container/classRoom')">教室管理</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="2">
          <template slot="title">设置</template>
          <el-menu-item index="1-6" @click="goto('/container/updatePwd')">修改密码</el-menu-item>
          <el-menu-item index="1-7" @click="goto('/')">退出登录</el-menu-item>
        </el-submenu>
        <!--<el-submenu index="1-4">-->
          <!--<template slot="title">选项4</template>-->
          <!--<el-menu-item index="1-4-1">选项4-1</el-menu-item>-->
        <!--</el-submenu>-->
      </el-submenu>
    </el-menu>
  </el-aside>
</div>
</template>
<script>
export default {
  name: 'AsidePage',
  data () {
    return {
      r_id: '',
      a: false,
      b: false,
      c: false,
      d: false
    }
  },
  methods: {
    goto (path) {
      this.$router.replace(path)
    },
    hidden () {
      if (localStorage.getItem('user') !== 'null') {
        this.r_id = JSON.parse(localStorage.getItem('user')).r_id
        // console.log(JSON.parse(localStorage.getItem('user')))
        if (this.r_id === 1) {
          this.c = true
          this.d = true
        } else if (this.r_id === 2) {
          this.a = true
          this.b = true
        }
      }
    }
  },
  created () {
    this.hidden()
  }
}
</script>

<style scoped>
  .el-aside {
    color: #333;
  }
</style>
