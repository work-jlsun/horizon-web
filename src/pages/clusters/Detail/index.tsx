import DetailCard, {Param} from '@/components/DetailCard'
import {useState} from "react";
import {Avatar, Button, Card, Divider, Table} from 'antd';
import {querySchema} from '@/services/templates/templates';
import Detail from '@/components/PageWithBreadcrumb';
import {useModel} from '@@/plugin-model/useModel';
import 'antd/lib/form/style';
import styles from './index.less'
import utils from '@/utils';
import {ReloadOutlined} from '@ant-design/icons';
import {useHistory, useIntl} from 'umi';
import JsonSchemaForm from '@/components/JsonSchemaForm';
import {useRequest} from '@@/plugin-request/request';
import {getCluster, getClusterTags} from "@/services/clusters/clusters";
import RBAC from '@/rbac';
import {ResourceType} from "@/const";

export default () => {
  const intl = useIntl();
  const history = useHistory();
  const {initialState} = useModel("@@initialState")
  const {id: clusterID, name: clusterName, fullPath: clusterFullPath, type} = initialState!.resource
  const defaultCluster: CLUSTER.Cluster = {
    id: 0,
    application: {
      id: 0,
      name: '',
    },
    name: '',
    priority: 'P0',
    description: '',
    template: {
      name: '',
      release: '',
    },
    git: {
      url: '',
      subfolder: '',
      branch: '',
      commit: '',
    },
    scope: {
      environment: '',
      region: '',
      regionDisplayName: '',
    },
    templateInput: undefined,
    fullPath: '',
    createdAt: '',
    updatedAt: '',
  }
  const [cluster, setCluster] = useState<CLUSTER.Cluster>(defaultCluster)
  const [tags, setTags] = useState<CLUSTER.ClusterTag[]>()
  const [template, setTemplate] = useState([])
  const serviceDetail: Param[][] = [
    [
      {key: intl.formatMessage({id: 'pages.clusterDetail.basic.name'}), value: cluster.name},
      {key: intl.formatMessage({id: 'pages.clusterDetail.basic.description'}), value: cluster.description || ''},
      {key: intl.formatMessage({id: 'pages.clusterDetail.basic.priority'}), value: cluster.priority},
    ],
    [
      {
        key: intl.formatMessage({id: 'pages.clusterDetail.basic.release'}),
        value: cluster.template.name + '-' + cluster.template.release
      },
      {key: intl.formatMessage({id: 'pages.clusterDetail.basic.url'}), value: cluster.git.url},
      {key: intl.formatMessage({id: 'pages.clusterDetail.basic.subfolder'}), value: cluster.git.subfolder},
      {key: intl.formatMessage({id: 'pages.clusterDetail.basic.branch'}), value: cluster.git.branch},
    ],
    [
      {
        key: intl.formatMessage({id: 'pages.clusterDetail.basic.createTime'}),
        value: utils.timeToLocal(cluster.createdAt)
      },
      {
        key: intl.formatMessage({id: 'pages.clusterDetail.basic.updateTime'}),
        value: utils.timeToLocal(cluster.updatedAt)
      },
    ],
  ]

  const {run: refreshCluster} = useRequest(() => {
    return getCluster(clusterID).then(({data: result}) => {
      setCluster(result);
      // query schema by template and release
      querySchema(result.template.name, result.template.release).then(({data}) => {
        setTemplate(data);
      });
    });
  }, {
    ready: type === ResourceType.CLUSTER && !!clusterID,
    refreshDeps: [clusterID]
  })

  const {run: refreshTags} = useRequest(() => {
    return getClusterTags(clusterID).then(({data: result}) => {
      setTags(result.tags);
    });
  }, {
    ready: type === ResourceType.CLUSTER && !!clusterID,
    refreshDeps: [clusterID]
  })

  const firstLetter = clusterName.substring(0, 1).toUpperCase();

  const editClusterRoute = `/clusters${clusterFullPath}/-/edit`;
  const manageTagsRoute = `/clusters${clusterFullPath}/-/tags`;
  const tagColumns = [
    {
      title: '键',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
    }
  ]

  return (
    <Detail>
      <div>
        <div className={styles.avatarBlock}>
          <Avatar className={`${styles.avatar} identicon bg${utils.getAvatarColorIndex(clusterName)}`} size={64}
                  shape={"square"}>
            <span className={styles.avatarFont}>{firstLetter}</span>
          </Avatar>
          <span className={styles.titleFont}>{clusterName}</span>
          <div className={styles.flex}/>
          <Button className={styles.button} onClick={refreshCluster}><ReloadOutlined/></Button>
          {
            RBAC.Permissions.updateCluster.allowed && <Button
              type="primary" className={styles.button}
              onClick={() =>
                history.push({
                  pathname: editClusterRoute,
                })
              }
            >
              {intl.formatMessage({id: 'pages.clusterDetail.basic.edit'})}
            </Button>
          }
        </div>
      </div>
      <Divider className={styles.groupDivider}/>
      <DetailCard title={(
        <span className={styles.cardTitle}>{intl.formatMessage({id: 'pages.clusterDetail.basic.detail'})}</span>)}
                  data={serviceDetail}/>
      <Card title={(
        <span className={styles.cardTitle}>{intl.formatMessage({id: 'pages.clusterDetail.basic.config'})}</span>)}
            type={"inner"}>
        {
          template && Object.keys(template).map((item) => {
            return (
              <JsonSchemaForm
                key={item}
                disabled={true}
                uiSchema={template[item].uiSchema}
                formData={cluster.templateInput[item]}
                jsonSchema={template[item].jsonSchema}
              />)
          })
        }
      </Card>
      <Card
        style={{marginTop: '20px'}}
        title={(
          <div style={{display: "flex"}}>
            <span className={styles.cardTitle}>标签</span>
            <div style={{flex: 1}}/>
            <Button
              onClick={
                () =>
                  history.push({
                    pathname: manageTagsRoute,
                  })
              }
            >管理标签</Button>
          </div>
        )}
        type={"inner"}>
        <Table
          dataSource={tags}
          columns={tagColumns}
        />

      </Card>
    </Detail>
  )
}
