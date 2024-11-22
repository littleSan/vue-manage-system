<template>
  <div>
    <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
    <div class="container">
      <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                   :delFunc="handleDelete" :editFunc="handleEdit" :refresh="getData" :currentPage="page.index"
                   :changePage="changePage" :hasPagination = false>
        <template #toolbarBtn>
          <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
        </template>
        <template #url="{ rows }">
          <el-image class="table-td-thumb" :src="rows.url" :z-index="10" :preview-src-list="[rows.url]"
                    preview-teleported>
          </el-image>
        </template>
        <template #type="{ rows }">
          <el-tag :type="rows.type === 1 ? 'success' : 'primary'">
            {{ rows.type === 1 ? '系统banner' : '产品banner' }}
          </el-tag>
        </template>
      </TableCustom>

    </div>

    <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
               :close-on-click-modal="false" @close="closeDialog">
      <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData">
        <template #rul="{ rows }">
          <img class="table-td-thumb" :src="rows.url"></img>
        </template>
      </TableEdit>
    </el-dialog>


    <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
      <TableDetail :data="viewData">
        <template #url="{ rows }">
          <el-image :src="rows.url"></el-image>
        </template>
      </TableDetail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import {bannerList, fetchData,deleteBanner,bannerAdd} from '@/api/index';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import TableEdit from '@/components/table-edit.vue';
import { BannerItem } from '@/types/banner';
import { FormOption, FormOptionList } from '@/types/form-option';

// 查询相关
const query = reactive({
  type: {label:'系统',value: 1},
});
const searchOpt = ref<FormOptionList[]>([
  { type: 'select', label: '类型', prop: 'type',placeholder : '', opts:[{label:'系统',value: 1},{label:'产品',value:2}] }
])
const handleSearch = () => {
  console.log("param",query)
  changePage(query);
};

// 表格相关
let columns = ref([
  { type: 'selection' },
  // { type: 'index', label: '序号', width: 55, align: 'center' },
     { prop: 'id', label: 'bannerId' },
  // { prop: 'sourceId', label: '资源ID' },
  { prop: 'url', label: '图片地址' },
  { prop: 'type', label: '类型' },
  { prop: 'weight', label: '权重' },
  { prop: 'operator', label: '操作', width: 250 },
])
const page = reactive({
  index: 1,
  size: 10,
  total: 4,
})
const tableData = ref<BannerItem[]>([]);

const getData = async (param) => {

  const res = await bannerList(param)
  tableData.value = res.data.data;
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
    { type: 'input', label: '资源', prop: 'informationId', required: true },
    { type: 'number', label: '权重', prop: 'weight', required: true },
    { type: 'upload', label: 'banner', prop: 'url', required: true },
    { type: 'select', label: '类型', prop: 'type', required: true ,opts:[{label:'系统',value: 1},{label:'产品',value:2}]},
  ]
})
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: BannerItem) => {
  ElMessage.info("banner不允许编辑")
  return
  // rowData.value = { ...row };
  // isEdit.value = true;
  // visible.value = true;
};
const updateData = async (param) => {
  closeDialog();
  if(param["id"] === '' || param["id"] === undefined){
    console.log("新增",param);
    await bannerAdd(param);
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
const handleView = (row: BannerItem) => {
  viewData.value.row = { ...row }
  viewData.value.list = [
    {
      prop: 'id',
      label: 'bannerId',
    },
    // {
    //   prop: 'informationId',
    //   label: '资源ID',
    // },
    {
      prop: 'url',
      label: 'banner地址',
    },
    {
      prop: 'weight',
      label: '权重',
    },
    {
      prop: 'type',
      label: '类型',
    },
  ]
  visible1.value = true;
};

// 删除相关
const handleDelete = async (row: BannerItem) => {
  const res = await deleteBanner({id:row.id});
  if(res.data.code === 200){
    ElMessage.success('删除成功');
    getData({});
  }
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
