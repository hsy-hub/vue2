<template>
<div>
  <el-header style="text-align: right; font-size: 12px">
    <span>学生管理系统</span>
    <el-dropdown @command="handleCommand">
      <i class="el-icon-setting" style="margin-right: 15px"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>查看</el-dropdown-item>
        <el-dropdown-item>编辑</el-dropdown-item>
        <el-dropdown-item>新增</el-dropdown-item>
        <el-dropdown-item>删除</el-dropdown-item>
        <el-dropdown-item command="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span>{{loginName}}</span>
  </el-header>
</div>
</template>

<script>
export default {
  name: 'HeaderPage',
  data () {
    return {
      loginName: ''
    }
  },
  methods: {
    handleCommand () {
      // this.$message('退出登录')
      this.$message({
        message: '退出登录',
        type: 'success'
      })
      localStorage.setItem('user', null) // 清空数据
      // 如果前端拿到状态码为401，就清除token信息并跳转到登录页面
      localStorage.removeItem('Authorization')
      // localStorage.setItem('token', null)
      this.$router.push('/')
    }
  },
  created () {
    // console.log(localStorage.getItem('user')) // 字符串
    //  console.log(JSON.parse(localStorage.getItem('user'))) // 对象
    if (localStorage.getItem('user') !== 'null') {
      this.loginName = JSON.parse(localStorage.getItem('user')).name
    }
  }
}
</script>

<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
</style>
