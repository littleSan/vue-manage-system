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
        <template #coverUrl="{ rows }">
          <el-image class="table-td-thumb" :src="rows.coverUrl" :z-index="10" :preview-src-list="[rows.coverUrl]"
                    preview-teleported>
          </el-image>
        </template>
        <template #description="{ rows }">
          <div v-if="rows.description.length < 12">{{ rows.description }}</div>
          <!-- 大于12为只展示12位 -->
          <el-tooltip v-if="rows.description.length > 12" popper-class="testtooltip" :content="rows.description" placement="top-start">
            <div>{{ rows.description.slice(0, 12) }}</div>
          </el-tooltip>
        </template>
        <template #content="{ rows }">
          <div v-if="rows.content.length <= 12">{{ rows.content }}</div>
          <!-- 大于12为只展示12位 -->
          <el-tooltip v-if="rows.content.length > 12" popper-class="testtooltip" :content="rows.content">
            <div>{{ rows.content.slice(0, 12) }}</div>
          </el-tooltip>
        </template>
      </TableCustom>

    </div>
    <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
               :close-on-click-modal="false" @close="closeDialog">
      <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData">
        <template #coverUrl="{ rows }">
          <img class="table-td-thumb" :src="rows.coverUrl"></img>
        </template>
      </TableEdit>
    </el-dialog>
    <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
      <TableDetail :data="viewData">
        <template #coverUrl="{ rows }">
          <el-image :src="rows.coverUrl"></el-image>
        </template>
        <template #content="{ rows }">
          <div v-html="rows.content"  style="width:600px" ></div>
        </template>
      </TableDetail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import {fetchData, informationList} from '@/api/index';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import { TableItem } from '@/types/table';
import { FormOption, FormOptionList } from '@/types/form-option';
import {InformationItem} from "@/types/information";

// 查询相关
const query = reactive({
  title: '',
});
const searchOpt = ref<FormOptionList[]>([
  { type: 'input', label: '文章标题：', prop: 'title' }
])
const handleSearch = () => {
  changePage(1);
};

// 表格相关
let columns = ref([
  { type: 'selection' },
  { type: 'index', label: '序号', width: 55, align: 'center' },
  { prop: 'title', label: '标题',width : 300,},
  { prop: 'coverUrl', label: '封面' },
  { prop: 'url', label: '来源' },
  { prop: 'status', label: '状态' },
  { prop: 'author', label: '作者' },
  { prop: 'weight', label: '权重' },
  { prop: 'type', label: '类型' },
  { prop: 'description', label: '简介' },
  { prop: 'content', label: '文章内容' },

  { prop: 'operator', label: '操作', width: 250 },
])
const page = reactive({
  index: 1,
  size: 10,
  total: 200,
})
const tableData = ref<InformationItem[]>([]);

const getData = async (param) => {
  const res = await informationList(param)
  tableData.value = res.data.data.data;

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
    { type: 'input', label: '标题', prop: 'title', required: true },
    { type: 'upload', label: '封面', prop: 'coverUrl', required: false },
    { type: 'input', label: '来源', prop: 'url', required: false },
    { type: 'input', label: '简介', prop: 'description', required: true },
    { type: 'number', label: '权重', prop: 'weight', required: false },
    { type: 'select',label: '类型', prop: 'type',opts:[{label:'护理百科',value: 1},{label:'公司动态',value:2},{label:'行业动态',value:3}], required: true },
    { type: 'input', label: '文章内容', prop: 'content', required: true },

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
const handleView = (row: TableItem) => {
  viewData.value.row = { ...row }
  viewData.value.list = [
    {
      prop: 'id',
      label: '文章ID',
    },
    {
      prop: 'title',
      label: '文章标题',
    },
    {
      prop: 'url',
      label: '文章来源',
    },
    {
      prop: 'status',
      label: '状态',
    },
    {
      prop: 'author',
      label: '作者',
    },
    {
      prop: 'weight',
      label: '权重',
    },
    {
      prop: 'type',
      label: '类型',
    },
    {
      prop: 'coverUrl',
      label: '文章封面',
    },
    {
      prop: 'description',
      label: '简介',
    },
    {
      prop: 'content',
      label: '文章内容',
    },


  ]
  visible1.value = true;
};

// 删除相关
const handleDelete = (row: TableItem) => {
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
