<template>
  <div>
    <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
    <div class="container">
      <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                   :delFunc="handleDelete" :editFunc="handleEdit" :refresh="getData" :currentPage="page.index"
                   :changePage="changePage">
        <template #toolbarBtn>
          <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
        </template>
        <template #image="{ rows }">
          <el-image class="table-td-thumb" :src="rows.image" :z-index="10" :preview-src-list="[rows.image]"
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
import { FormOption, FormOptionList } from '@/types/form-option';
import {ProductItem} from "@/types/product";
import {productList} from "@/api";
// 查询相关
const query = reactive({
  type: {label:'造口袋',value: 1},
});
const searchOpt = ref<FormOptionList[]>([
  { type: 'select', label: '产品类型', prop: 'type',placeholder : '', opts:[{label:'造口袋',value: 1},{label:'造口盘',value:2},{label:'造口附件',value:3}] }
]);
const handleSearch = () => {
  console.log("param",query);
  let a = {category:query.type};
  getData(a)
};

// 表格相关
let columns = ref([
  { type: 'selection' },
  { type: 'index', label: '序号', width: 55, align: 'center' },
  { prop: 'id', label: '产品ID' },
  { prop: 'name', label: '名称' },
  { prop: 'unit', label: '单位' },
  { prop: 'image', label: '图片' },
  { prop: 'attribute', label: '属性' },
  { prop: 'operator', label: '操作', width: 250 },
])
const page = reactive({
  index: 1,
  size: 10,
  total: 4,
})
const tableData = ref<ProductItem[]>([]);

const getData = async (param) => {

  const res = await productList(param)
  console.log("res",res.data.data)
  tableData.value = res.data.data;
  console.log("tableData",tableData.value)
};
getData({category:1});

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
    { type: 'input', label: '单位', prop: 'unit', required: true },
    { type: 'upload', label: '图片', prop: 'image', required: true },
    { type: 'select', label: '产品类型', prop: 'category', required: true ,opts:[{label:'造口袋',value: 1},{label:'造口盘',value:2},{label:'造口附件',value:3}]},
    { type: 'input', label: '属性', prop: 'attribute', required: true },
  ]
})
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: ProductItem) => {
  rowData.value = { ...row };
  isEdit.value = true;
  visible.value = true;
};
const updateData = (param) => {
  closeDialog();
  getData(param);
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
const handleView = (row: ProductItem) => {
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
      prop: 'unit',
      label: '单位',
    },
    {
      prop: 'image',
      label: '图片',
    },
    {
      prop: 'attribute',
      label: '属性',
    },
    {
      prop: 'category',
      label: '产品类型',
    }
  ]
  visible1.value = true;
};

// 删除相关
const handleDelete = (row: ProductItem) => {
  ElMessage.success('删除成功');
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
