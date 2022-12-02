import { Modal, Switch } from 'antd';
import { useModel } from 'umi';
import { updateUserByID } from '@/services/users/users';

export default function AdminSwitch(props: { id: number, isAdmin: boolean, onSwith: (checked: boolean) => void }) {
  const { id, isAdmin, onSwith } = props;
  const { successAlert } = useModel('alert');
  const onChange = (newPermission: boolean) => {
    Modal.confirm(
      {
        title: 'Admin',
        content: '确定更新用户admin权限',
        onOk: () => {
          updateUserByID(id, newPermission).then(() => {
            onSwith(newPermission);
            successAlert('用户权限更新成功');
          });
        },
      },
    );
  };
  return <Switch key={id} checked={isAdmin} onChange={onChange} />;
}