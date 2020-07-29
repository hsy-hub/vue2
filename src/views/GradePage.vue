<template>
  <el-main>
    <div>
      <el-row class="btns">
        <el-input v-model="input" style="width: 200px;margin-right: 20px" placeholder="请输入关键字" clearable>
        </el-input>
        <el-button type="primary" icon="el-icon-search" @click="search(input)">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addDialogVisible = true" round>添加用户</el-button>
        <el-button type="danger" icon="el-icon-minus" round @click="dels()">批量删除</el-button>
      </el-row>
    </div>
    <el-table :data="userList" border style="width: 100%"  max-height="400"
              show-summary>
      <el-table-column type="selection" width="55"></el-table-column><!--复选框-->
      <el-table-column prop="id" label="ID" width="140">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120" sortable>
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="120">
      </el-table-column>
      <el-table-column prop="majorName" label="专业" width="120">
      </el-table-column>
      <el-table-column prop="className" label="班级" width="120" sortable>
      </el-table-column>
      <el-table-column prop="credit" label="学分" width="120" sortable>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <!--<page></page>-->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[3, 5, 7, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total=totalCount>
        </el-pagination>
      </div>
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
        <add-user></add-user>
      </el-dialog>
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
        <edit-user ref="edit"></edit-user>
      </el-dialog>
    </div>
  </el-main>
</template>
<script>
export default {
  name: 'GradePage',
  components: {
  },
  data () {
    return {
      options: [
        { value: 'name', lable: '1' },
        { value: 'majorName', lable: '2' },
        { value: 'className', lable: '3' }
      ],
      userList: [],
      input: '',
      checked: true,
      addDialogVisible: false,
      editDialogVisible: false,
      ids: '',
      pageSize: 3,
      totalCount: 0,
      currentPage: 1,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4
    }
  },
  created () {
    this.getList(this.input, this.currentPage, this.pageSize)
    this.getUserListCount()
  },
  methods: {
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
      // console.log('this.pageSize>>>' + this.pageSize)
      this.getList(this.input, this.currentPage, this.pageSize)
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      // console.log('this.currentPage>>>' + this.currentPage)
      this.getList(this.input, this.currentPage, this.pageSize)
    },
    getList (name, currentPage, pageSize) {
      this.$axios.post('http://localhost:8081/getUserPageSearch',
        this.$qs.stringify({
          name: name,
          currentPage: currentPage,
          pageSize: pageSize
        })).then(d => {
        if (d.data.code === 0) {
          for (let i = 0; i < d.data.data.length; i++) {
            // console.log(d.data.data[i].imagePath)
            // const pathArr = (d.data.data[i].imagePath || '').split(',') // 无法读取空的属性“split” 所以加上 || ''做判断
            this.userList.push({
              id: d.data.data[i].id,
              name: d.data.data[i].name,
              gender: d.data.data[i].gender,
              majorName: d.data.data[i].major.majorName,
              className: d.data.data[i].class_.className,
              credit: d.data.data[i].grade.credit
              // imagePath: 'http://localhost:8081/upload/' + pathArr[0]
            })
          }
          // this.userList = d.data.data
        } else if (d.body.code === -1) {
          this.userList = []
        }
      })
    },
    getUserListCount () {
      this.$axios.get('http://localhost:8081/getUserCount',
        this.$qs.stringify({
          name: this.input
        })).then(d => {
        if (d.data.code === 0) {
          this.totalCount = d.data.result
        }
      })
    },
    search () {
      this.searchByName()
      // this.searchByMajor()
    },
    searchByName () {
      this.$axios.post('http://localhost:8081/getUserByName',
        this.$qs.stringify({
          name: this.input
        })).then(d => {
        if (d.data.code === 0) {
          this.userList = d.data.data
          this.getUserListCount()
        }
      })
    },
    searchByMajor () {
      this.$axios.post('http://localhost:8081/getUserByMajor',
        this.$qs.stringify({
          majorName: this.input
        })).then(d => {
        if (d.data.code === 0) {
          this.userList = d.data.data
          this.getUserListCount()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
