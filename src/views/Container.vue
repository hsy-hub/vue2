<template>
  <el-container>
    <el-header>
      <header-page></header-page>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <aside-page></aside-page>
      </el-aside>
      <el-container>
        <!--<el-main>-->
          <router-view></router-view>
        <!--</el-main>-->
        <el-footer>
          <footer-page></footer-page>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import FooterPage from './FooterPage'
import AsidePage from './AsidePage'
import HeaderPage from './HeaderPage'
export default {
  name: 'Container',
  components: { AsidePage, FooterPage, HeaderPage }
}
</script>

<style scoped>

</style>
