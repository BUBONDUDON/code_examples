import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Modal, Select, Space } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import ListTags from "./list-tags";
import { useTasks } from "@/shared/model/tasks.tsx";

type TaskFormValues = {
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  tags: string[];
};

type Props =
  | { mode?: "create"; initialValues?: Partial<TaskFormValues>; onCreated?: () => void }
  | { mode: "edit"; taskId: string; initialValues?: Partial<TaskFormValues>; onUpdated?: () => void };

const TaskModal: React.FC<Props> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<TaskFormValues>();
  const { createTask, updateTask, getTaskById } = useTasks();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (props.mode === "edit") {
        const taskId = props.taskId as string;
        updateTask({
          id: taskId,
          title: values.title,
          description: values.description,
          status: values.status,
          priority: values.priority,
          tags: values.tags ?? [],
        });
        props.onUpdated?.();
      } else {
        createTask({
          title: values.title,
          description: values.description,
          status: values.status,
          priority: values.priority,
          tags: values.tags ?? [],
        });
        (props as { onCreated?: () => void }).onCreated?.();
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch {
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const statusOptions = useMemo(
    () => [
      { label: "To do", value: "todo" },
      { label: "In progress", value: "in-progress" },
      { label: "Done", value: "done" },
    ],
    []
  );

  const priorityOptions = useMemo(
    () => [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ],
    []
  );

  useEffect(() => {
    if (props.mode === "edit" && props.taskId) {
      const task = getTaskById(props.taskId);
      if (task) {
        form.setFieldsValue({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          tags: task.tags,
        });
      }
    }
  }, [form, getTaskById, props]);

  return (
    <>
      {(props.mode === "edit") ? (
        <Button icon={<EditOutlined />} onClick={showModal}>
          Редактировать
        </Button>
      ) : (
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Добавить задачу
        </Button>
      )}
      <Modal
        title={props.mode === "edit" ? "Редактировать задачу" : "Новая задача"}
        closable={{ "aria-label": "Закрыть" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            title: props.initialValues?.title ?? "",
            description: props.initialValues?.description ?? "",
            status: props.initialValues?.status ?? "todo",
            priority: props.initialValues?.priority ?? "medium",
            tags: props.initialValues?.tags ?? [],
          }}
        >
          <Form.Item name="title" label="Название" rules={[{ required: true, message: "Введите название" }]}>
            <Input size="large" placeholder="Например: Починить баг в форме" />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={3} placeholder="Краткое описание задачи" />
          </Form.Item>
          <Space size="middle" direction="vertical" style={{ width: "100%" }}>
            <Form.Item name="status" label="Статус" rules={[{ required: true }]}> 
              <Select options={statusOptions} />
            </Form.Item>
            <Form.Item name="priority" label="Приоритет" rules={[{ required: true }]}> 
              <Select options={priorityOptions} />
            </Form.Item>
          </Space>
          <Form.Item name="tags" label="Теги">
            <ListTags />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TaskModal;
