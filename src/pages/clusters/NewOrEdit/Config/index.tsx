import {useIntl, useRequest} from 'umi';
import {querySchema} from '@/services/templates/templates';
import JsonSchemaForm from '@/components/JsonSchemaForm';
import {Card} from 'antd';
import styles from '../index.less';
import {ResourceType} from '@/const'

export default (props: any) => {
  const intl = useIntl();

  const {readonly = false} = props;

  // query schema by template and release
  const {data} = useRequest(() => querySchema(props.template.name, props.release, {
    clusterID: props.clusterID,
    resourceType: ResourceType.CLUSTER,
  }));

  const titlePrefix = 'pages.applicationNew.config';

  return (
    <div>
      {data &&
      Object.keys(data).map((item) => {
        const currentFormData = props.config[item] || {};

        const onChange = ({formData, errors}: any) => {
          if (readonly) {
            return;
          }
          props.setConfig((config: any) => ({...config, [item]: formData}));
          props.setConfigErrors((configErrors: any) => ({...configErrors, [item]: errors}));
        };

        const {jsonSchema, uiSchema} = data[item];

        return (
          <Card
            className={styles.gapBetweenCards}
            key={item}
            title={intl.formatMessage({id: `${titlePrefix}.${item}`})}
          >
            <JsonSchemaForm
              disabled={readonly}
              formData={currentFormData}
              jsonSchema={jsonSchema}
              onChange={onChange}
              uiSchema={uiSchema}
              liveValidate
              showErrorList={false}
            />
          </Card>
        );
      })}
    </div>
  );
};
