// 工程项目管理器，用于管理产出的数据（保存、下拉）
import request from '@utils/request.js';
import store from '@store';

const APIS = {
  createProject: '/api/project/create',
  updateProject: '/api/project/update',
  getProject: '/api/project/projectdata',
  deleteProject: '/api/project/delete',
  publishProject: '/api/project/publish',
  unPublish: '/api/project/unpublish',
  projectList: '/api/project/projectList'
}

// 保存
/**
 * 
 * @param {*} props 
 * {key,
    projectName,
    jsonData,
    picUrl}
 */
function update(props){
  return request.post(APIS.updateProject, props);
}
/**
 * 
 * @param {*} props 
 * {projectName,
    jsonData,
    picUrl}
 */
function create(props){
  return request.post(APIS.createProject, props);
}

// 下拉画布数据
async function getProjectData(key, remember=true){
  const ans = await request.get(APIS.getProject, {
    params: {
      key: key
    }
  });
  const { projectId, name, jsonData, status } = ans;
  const data = JSON.parse(jsonData);
  store.commit('setComponentData', data.componentData);
  store.commit('setCanvasStyle', data.canvasStyle);
  store.commit('setDefaultcomponentData', data.componentData);

  // 修改projectId会记住本次的Id，但是在非编辑页时不应该进行记录
  if(remember) {
    store.commit('setProject', {
      key: projectId,
      name,
      status
    })
  }
  return ans;
}

// 发布 (可能是有key的直接发布或者是只有内容的发布)
/**
 * 
 * @param {*} props 
 * {key,
    projectName,
    jsonData,
    picUrl}
 */
function publish(props){
  return request.post(APIS.publishProject, props);
}

function unPublish(key){
  return request.post(APIS.unPublish, {key});
}

// 删除
function deleteProject(key){
  return request.post(APIS.deleteProject, key);
}

function getProjectList(params) {
  return request.get(APIS.projectList, {
    params
  })
}

export default {
  update,
  getProjectData,
  create,
  publish,
  deleteProject,
  unPublish,
  getProjectList
}