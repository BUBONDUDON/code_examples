import { useParams } from "react-router-dom";
import { useTasks } from "@/shared/model/tasks.tsx";
import {
  Button,
  Card,
  Descriptions,
  Modal,
  Space,
  Tag,
  Typography,
} from "antd";
import MyModal from "@/features/modal/my-modal";
import { DeleteOutlined } from "@ant-design/icons";
function Task() {
  const params = useParams();
  const { getTaskById, deleteTask } = useTasks();
  const task = params.taskId ? getTaskById(params.taskId) : undefined;

  if (!task) return <Typography.Text>Задача не найдена</Typography.Text>;

  const confirmDelete = () => {
    Modal.confirm({
      title: "Удалить задачу?",
      content: "Это действие необратимо",
      okText: "Удалить",
      okButtonProps: { danger: true, icon: <DeleteOutlined /> },
      cancelText: "Отмена",
      onOk: () => {
        deleteTask(task.id);
      },
    });
  };

  return (
    <Card
      title={task.title}
      style={{ margin: 24 }}
      extra={
        <Space>
          <MyModal mode="edit" taskId={task.id} />
          <Button danger icon={<DeleteOutlined />} onClick={confirmDelete}>
            Удалить
          </Button>
        </Space>
      }
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Статус">{task.status}</Descriptions.Item>
        <Descriptions.Item label="Приоритет">{task.priority}</Descriptions.Item>
        <Descriptions.Item label="Создана">
          {task.createdAt.toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Описание">
          {task.description ?? "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Теги">
          <Space wrap>
            {task.tags.length
              ? task.tags.map((t) => <Tag key={t}>{t}</Tag>)
              : "—"}
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

export const Component = Task;
