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
    <el-table :data="userList1" border style="width: 100%"  max-height="400"
              :summary-method="getSummaries"
              show-summary
              @selection-change="selsChange">
      <el-table-column type="selection" width="55"></el-table-column><!--复选框-->
      <el-table-column prop="id" label="ID" width="140">
      </el-table-column>
      <el-table-column
        label="姓名"
        width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.name }}</p>
            <p>年龄: {{ scope.row.age }}</p>
            <p>性别: {{ scope.row.gender }}</p>
            <p>级别: {{ scope.row.level}}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="120" sortable>
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="120">
      </el-table-column>
      <!--<el-table-column prop="level" label="级别" width="120">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="classnum" label="教室" width="120">-->
    <!--</el-table-column>-->
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
  name: 'UserList1',
  components: {
    // AddUser,
    // EditUser
  },
  data () {
    return {
      userList1: [],
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
      this.$axios.post('http://localhost:8081/getUserListSearch',
        this.$qs.stringify({
          name: name,
          currentPage: currentPage,
          pageSize: pageSize
        })).then(d => {
        if (d.data.code === 0) {
          console.log(d)
          for (let i = 0; i < d.data.data.length; i++) {
            this.userList1.push({
              id: d.data.data[i].id,
              name: d.data.data[i].name,
              age: d.data.data[i].age,
              gender: d.data.data[i].gender,
              level: d.data.data[i].rank.level
              // classnum: d.data.data[i].classRoom.classnum
            })
          }
          // this.userList = d.data.data
        } else if (d.body.code === -1) {
          this.userList1 = []
        }
      })
    },
    getUserListCount () {
      this.$axios.get('http://localhost:8081/getUser1Count',
        this.$qs.stringify({
          name: this.input
        })).then(d => {
        if (d.data.code === 0) {
          this.totalCount = d.data.result
        }
      })
    },
    search () {
      this.$axios.post('http://localhost:8081/getUser1ByName',
        this.$qs.stringify({
          name: this.input
        })).then(d => {
        if (d.data.code === 0) {
          this.userList = d.data.data
          this.getUserListCount()
        }
      })
    },
    selsChange (val) { // 将选中的id用","分开
      for (let i = 0; i < val.length; i++) {
        if (i === 0) {
          this.ids = val[i].id
        }
        if (i >= 1) {
          this.ids = this.ids + ',' + val[i].id
        }
      }
      // console.log(this.ids) // 打印的位置不能放到最前面 否则再选中id时不能及时做出反应
    },
    dels () { // 批量删除
      // console.log('this.ids>>>' + this.ids)
      this.$confirm('此操作将永久删除该文件及其子文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8081/deleteUser1',
          this.$qs.stringify({
            ids: this.ids
          })).then(d => {
          if (d.data > 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            parent.location.reload()
            this.getList(this.input, this.currentPage, this.pageSize)
            this.getUserListCount()
          } else {
            this.$message({
              message: '删除失败',
              type: 'warning'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info', message: '已取消删除'
        })
      })
    },
    handleEdit (index, row) { // 单个用户操作
      // console.log(index, row)
      this.editDialogVisible = true
      // this.id = row.id
      // console.log('row.id>>>' + row.id)
      // 因为第一次打开子组件需要点时间才能初始化好子组件的data和methods 所以需要做一个时间延迟
      setTimeout(() => {
        this.$refs.edit.init(row.id)
      }, 100)
    },
    handleDelete (index, row) {
      // console.log(index, row)
      this.$confirm('是否删除用户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$axios.get('http://localhost:8081/delUserById1/' + row.id).then(d => {
          if (d.data === 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList(this.input, this.currentPage, this.pageSize)
            this.getUserListCount()
          } else {
            this.$message({
              message: '删除失败',
              type: 'warning'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' 岁'
        } else {
          sums[index] = 'N/A'
        }
      })

      return sums
    }
  }
}
</script>

<style scoped>

</style>
