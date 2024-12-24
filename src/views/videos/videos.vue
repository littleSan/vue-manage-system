<template>
  <div>
    <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
    <div class="container">
      <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                   :delFunc="handleDelete" :editFunc="handleEdit" :refresh="getData" :currentPage="page.index"
                   :changePage="changePage" :hasPagination = true>
        <template #toolbarBtn>
          <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
        </template>
<!--        <template #url="{ rows }">-->
<!--          <video width="320" height="240" controls>-->
<!--            <source :src="rows.url" type="video/mp4">-->
<!--          </video>-->
<!--        </template>-->
<!--        <template #coverUrl="{ rows }">-->
<!--          <el-image class="table-td-thumb" :src="rows.coverUrl" :z-index="10" :preview-src-list="[rows.coverUrl]"-->
<!--                    preview-teleported>-->
<!--          </el-image>-->
<!--        </template>-->
      </TableCustom>

    </div>

    <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
               :close-on-click-modal="false" @close="closeDialog">
      <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData">
       <template #url="{ rows }">
          <video width="320" height="240" controls>
            <source :src="rows.url" type="video/mp4">
          </video>
<!--          <video class="table-td-thumb" :src="rows.url" controls="controls"></video>-->
        </template>
<!--         <template #coverUrl="{ rows }">-->
<!--          <el-image class="table-td-thumb" :src="rows.coverUrl" :z-index="10" :preview-src-list="[rows.coverUrl]">-->
<!--          </el-image>-->
<!--        </template>-->
      </TableEdit>

    </el-dialog>


    <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
      <TableDetail :data="viewData">
        <template #url="{ rows }">
          <video width="320" height="240" controls>
            <source :src="rows.url" type="video/mp4">
          </video>
<!--          <video class="table-td-thumb" :src="rows.url" controls="controls"></video>-->
        </template>
         <template #coverUrl="{ rows }">
          <el-image class="table-td-thumb" :src="rows.coverUrl" :z-index="10" :preview-src-list="[rows.coverUrl]">
          </el-image>
        </template>
      </TableDetail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import {filePageList, deleteFile,fileAdd,fileUpdate} from '@/api/index';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import TableEdit from '@/components/table-edit.vue';
import { VideoItem } from '@/types/video';
import { FormOption, FormOptionList } from '@/types/form-option';

// 查询相关
const query = reactive({
  name: "",
});
const searchOpt = ref<FormOptionList[]>([
  { type: 'input', label: '名称', prop: 'name',placeholder : '请输入名称' }
])
const handleSearch = () => {
  console.log("param",query)
  if (query.name != ''){
   changePage(query);
  }else{
    changePage({});
  }

};

// 表格相关
let columns = ref([
  { type: 'selection' },
  // { type: 'index', label: '序号', width: 55, align: 'center' },
     { prop: 'name', label: '名称' },
  { prop: 'description', label: '描述' },
  { prop: 'url', label: '视频' },
  { prop: 'weight', label: '权重' },
  // { prop: 'coverUrl', label: '封面' },
  { prop: 'operator', label: '操作', width: 250 },
])
const page = reactive({
  index: 1,
  size: 10,
  total: 4,
})
const tableData = ref<VideoItem[]>([]);

const getData = async (param) => {

  const res = await filePageList(param)

  console.log("result",res)
  tableData.value = res.data.data.data;
  page.total = res.data.data.total;
  page.index = res.data.data.page;
};
getData({});
const changePage = (param) => {
  // page.index = val;
  getData(param);
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
  labelWidth: '100px',
  span: 24,
  list: [
    { type: 'input', label: '名称', prop: 'name', required: true },
    { type: 'number', label: '权重', prop: 'weight', required: true },
    { type: 'input', label: '描述', prop: 'description', required: true },
    { type: 'videosUpload', label: '视频', prop: 'url', required: true },
    // { type: 'videosUpload', label: '封面', prop: 'coverUrl', required: true },
  ]
})
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: VideoItem) => {
  // ElMessage.info("banner不允许编辑")
  // return
  rowData.value = { ...row };
  isEdit.value = true;
  visible.value = true;
};
const updateData = async (param) => {
  closeDialog();
  if(param["id"] === '' || param["id"] === undefined){
    console.log("新增",param);
    await fileAdd(param);
  }else{
    console.log("更新")
    const res = await fileUpdate(param);
    console.log('res',res)
    if (res.data.code == 200200){
      ElMessage.success('更新banner成功');
    }
  }
  getData({});
};

const closeDialog = () => {
  visible.value = false;
  isEdit.value = false;
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
  row: {},
  list: []
});
const handleView = (row: VideoItem) => {
  viewData.value.row = { ...row }
  viewData.value.list = [
    // {
    //   prop: 'id',
    //   label: '文件ID',
    // },
    // {
    //   prop: 'informationId',
    //   label: '资源ID',
    // },
    {
      prop: 'url',
      label: '视频',
    },
    //     {
    //   prop: 'coverUrl',
    //   label: '封面图',
    // },
    {
      prop: 'weight',
      label: '权重',
    },
    {
      prop: 'description',
      label: '描述',
    },
  ]
  visible1.value = true;
};

// 删除相关
const handleDelete = async (row: VideoItem) => {
  const res = await deleteFile({id:row.id});
  console.log('res',res)
  if(res.data.code === 200200){
    ElMessage.success('删除成功');

  }
  getData({});
}
</script>

<style scoped>
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
