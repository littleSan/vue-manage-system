<template>
  <div>
<!--    <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />-->
    <div class="container">
      <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                   :delFunc="handleDelete" :editFunc="handleEdit" :refresh="getData" :currentPage="page.index"
                   :changePage="changePage" :hasPagination = false>
        <template #toolbarBtn>
          <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
        </template>
        <template #image="{ rows }">
          <el-image class="table-td-thumb" :src="rows.image" :z-index="20" :preview-src-list="[rows.image]"
                    preview-teleported>
          </el-image>
        </template>
      </TableCustom>

    </div>
    <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
               :close-on-click-modal="false" @close="closeDialog">
      <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData">
        <template #image="{ rows }">
          <img class="table-td-thumb" :src="rows.image"></img>
        </template>
      </TableEdit>
    </el-dialog>
    <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
      <TableDetail :data="viewData">
        <template #image="{ rows }">
          <el-image :src="rows.image"></el-image>
        </template>
      </TableDetail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import {fetchData, productCategoryList,productCategoryUpdate,productCategoryAdd} from '@/api/index';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import { TableItem } from '@/types/table';
import { FormOption, FormOptionList } from '@/types/form-option';
import {ProductCategoryItem} from "@/types/productCategory";

// 查询相关
const query = reactive({
    type: {label:'造口袋',value: 1},
});
const searchOpt = ref<FormOptionList[]>([
 { type: 'select', label: '产品类型', prop: 'type',placeholder : '', opts:[{label:'造口袋',value: 1},{label:'造口盘',value:2},{label:'造口附件',value:3}] }
])
const handleSearch = () => {
  changePage(1);
};

// 表格相关
let columns = ref([
    { type: 'selection' },
  // { type: 'index', label: '序号', width: 55, align: 'center' },
  { prop: 'id', label: '系列ID' },
  { prop: 'name', label: '名称' },
  { prop: 'image', label: '图片' },
  { prop: 'description', label: '描述' },
  { prop: 'operator', label: '操作', width: 250 },
])
const page = reactive({
  index: 1,
  size: 10,
  total: 10,
})
const tableData = ref<ProductCategoryItem[]>([]);

const getData = async (param) => {
  const res = await productCategoryList(param)
  console.log('res',res)
  tableData.value = res.data.data;
};
getData({});

const changePage = (val: number) => {
  getData(query);
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
  labelWidth: '100px',
  span: 24,
  list: [
    { type: 'input', label: '名称', prop: 'name', required: true },
    { type: 'upload', label: '图片', prop: 'image', required: true },
    { type: 'input', label: '描述', prop: 'description', required: true },
  ]
})
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: TableItem) => {
  rowData.value = { ...row };
  isEdit.value = true;
  visible.value = true;
};
const updateData = async (param) => {
 closeDialog();
  if (param["id"] == "" || param["id"] == undefined){
    console.log("新增")
    const res = await productCategoryAdd(param);
  }else{
    console.log("更新")
    const res = await productCategoryUpdate(param);
    console.log('res',res)
    if (res.data.code == 200200){

      ElMessage.success('更新产品分类信息成功');
    }
  }

  getData({})
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
const handleView = (row: TableItem) => {
  viewData.value.row = { ...row }
  viewData.value.list = [
    {
      prop: 'id',
      label: '资源ID',
    },
    {
      prop: 'name',
      label: '名称',
    },

    {
      prop: 'image',
      label: '图片',
    },
    {
      prop: 'description',
      label: '描述',
    },
  ]
  visible1.value = true;
};

// 删除相关
const handleDelete = (row: TableItem) => {
  ElMessage.error('产品分类无法删除');
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
