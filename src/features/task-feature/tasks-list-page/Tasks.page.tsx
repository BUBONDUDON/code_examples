import {
  Badge,
  Card,
  Col,
  Empty,
  Flex,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { useMemo, useState } from "react";
import { useTasks } from "@/shared/model/tasks.tsx";
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  ExclamationCircleTwoTone,
  FireTwoTone,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { TaskModal } from "@/features/modal";
import { ROUTES } from "@/shared/model/routes";

function Tasks() {
  const { tasks } = useTasks();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"todo" | "in-progress" | "done" | "">(
    ""
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "">("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (q && !`${t.title} ${t.description ?? ""}`.toLowerCase().includes(q))
        return false;
      if (status && t.status !== status) return false;
      if (priority && t.priority !== priority) return false;
      if (
        selectedTags.length > 0 &&
        !selectedTags.every((tg) => t.tags.includes(tg))
      )
        return false;
      return true;
    });
  }, [tasks, query, status, priority, selectedTags]);

  const statusOptions = [
    { value: "", label: "Все статусы" },
    { value: "todo", label: "To do" },
    { value: "in-progress", label: "In progress" },
    { value: "done", label: "Done" },
  ];
  const priorityOptions = [
    { value: "", label: "Все приоритеты" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const priorityColor: Record<string, string> = {
    low: "#91caff",
    medium: "#ffd666",
    high: "#ff7875",
  };

  const statusIcon: Record<string, React.ReactNode> = {
    todo: <ClockCircleTwoTone twoToneColor="#8c8c8c" />,
    "in-progress": <ExclamationCircleTwoTone twoToneColor="#1677ff" />,
    done: <CheckCircleTwoTone twoToneColor="#52c41a" />,
  };

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: "100%", height: "100%", padding: 24 }}
    >
      <Flex align="center" justify="space-between" wrap>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Задачи
        </Typography.Title>
        <TaskModal />
      </Flex>
      <Row gutter={[12, 12]}>
        <Col xs={24} md={10} lg={8} xl={6}>
          <Input.Search
            allowClear
            placeholder="Поиск по названию и описанию"
            onChange={(e) => setQuery(e.target.value)}
          />
        </Col>
        <Col xs={12} md={7} lg={6} xl={4}>
          <Select
            style={{ width: "100%" }}
            options={statusOptions}
            value={status}
            onChange={setStatus}
          />
        </Col>
        <Col xs={12} md={7} lg={6} xl={4}>
          <Select
            style={{ width: "100%" }}
            options={priorityOptions}
            value={priority}
            onChange={setPriority}
          />
        </Col>
        <Col xs={24} md={24} lg={8} xl={6}>
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Теги"
            value={selectedTags}
            onChange={setSelectedTags}
          />
        </Col>
      </Row>

      {filtered.length === 0 ? (
        <Empty description="Задачи не найдены" />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((t) => (
            <Col key={t.id} xs={24} sm={12} lg={8} xl={6}>
              <Card
                size="small"
                title={
                  <Space>
                    <span>{t.title}</span>
                    <Badge
                      color={priorityColor[t.priority]}
                      text={t.priority}
                    />
                  </Space>
                }
                styles={{
                  body: {
                    borderLeft: `4px solid ${priorityColor[t.priority]}`,
                  },
                }}
                extra={<Link to={`${ROUTES.TASKS}/${t.id}`}>Открыть</Link>}
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Space>
                    {statusIcon[t.status]}
                    <Typography.Text type="secondary">
                      {t.status}
                    </Typography.Text>
                    <FireTwoTone twoToneColor="#fa8c16" />
                  </Space>
                  {t.description && (
                    <Typography.Paragraph
                      ellipsis={{ rows: 2 }}
                      style={{ margin: 0 }}
                    >
                      {t.description}
                    </Typography.Paragraph>
                  )}
                  <Space wrap>
                    {t.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Space>
  );
}

export const Component = Tasks;
