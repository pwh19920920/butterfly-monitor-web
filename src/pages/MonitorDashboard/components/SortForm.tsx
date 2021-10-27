import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Col, Modal, Row, Spin} from "antd";
import {monitorDashboardTasksById} from "@/services/ant-design-pro/monitor.dashboard";
import {LoadingOutlined} from "@ant-design/icons";
import {DndProvider, DropTargetMonitor, useDrag, useDrop, XYCoord} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {debounce} from "lodash";

export const ItemTypes = {
  CARD: 'card',
}

export type SortFormProps = {
  initValues: API.MonitorDashboard;
  onCancel?: () => void;
  onSubmit: (dashboardTasks: API.MonitorDashboardTask[]) => Promise<void>;
  visible: boolean;
  title: string;
  width: string;
  onVisibleChange: (visible: boolean) => void;
};

const SortForm: React.FC<SortFormProps> = (props) => {
  const [dashboardTasks, setDashboardTasks] = useState<API.MonitorDashboardTask[]>();

  const loadTasks = async (dashboardId: string) => {
    const resp = await monitorDashboardTasksById(dashboardId);
    if (!resp.data || resp.data.length == 0) {
      Modal.info({
        title: '操作提示',
        content: (
          <div>
            <p>当前还没有向面板添加任何监控, 请先添加监控再进行排序工作</p>
          </div>
        ),
        onOk() {
          // 关闭窗口
          props.onVisibleChange(false);
        }
      });
    } else {
      setDashboardTasks([...resp.data]);
    }
  }

  useEffect(() => {
    loadTasks(props.initValues.id).then(() => {
    });
  }, [props.initValues.id]);

  if (!dashboardTasks) {
    return <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>;
  }

  type CardItemProps = {
    id: string;
    task: API.MonitorDashboardTask;
    index: number;
    moveCard: (dragIndex: number, hoverIndex: number) => void;
  }

  const styleTest = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
    userSelect: 'all'
  }

  const CardItem = ({id, task, index, moveCard}: CardItemProps) => {
    const ref = useRef(null)
    const [{isDragging, handlerId}, connectDrag] = useDrag({
      type: ItemTypes.CARD,
      item: {id, index},
      collect: (monitor) => {
        return {
          handlerId: monitor.getHandlerId(),
          isDragging: monitor.isDragging(),
        }
      },
    })

    const [, connectDrop] = useDrop({
      accept: ItemTypes.CARD,
      hover(item: any, monitor: DropTargetMonitor) {
       // console.log(item);
        if (!ref.current) {
          return
        }
        const dragIndex = item.index
        const hoverIndex = index

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return
        }

        // Determine rectangle on screen
        // @ts-ignore
        const hoverBoundingRect = ref.current?.getBoundingClientRect()

        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

        // Determine mouse position
        const clientOffset = monitor.getClientOffset()

        // Get pixels to the top
        const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return
        }

        // Time to actually perform the action
        moveCard(dragIndex, hoverIndex)

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        item.index = hoverIndex
      },
    })

    connectDrag(ref)
    connectDrop(ref)
    const opacity = isDragging ? 0 : 1
    const containerStyle = useMemo(() => ({...styleTest, opacity}), [opacity])

    // @ts-ignore
    return  <Col span={6} ref={ref} key={task.id} style={containerStyle} data-handler-id={handlerId}>
      <div>{task.taskName}</div>
      <div>{task.taskKey}</div>
    </Col>
  }

  // 容器
  const CardList = () => {
    const moveCard = (dragIndex: number, hoverIndex: number) => {
      const dragCol = dashboardTasks[dragIndex];
      const arr = dashboardTasks.slice();
      arr.splice(dragIndex, 1);
      arr.splice(hoverIndex, 0, dragCol);
      setDashboardTasks(arr);
    };
    const moveColumn = useCallback(debounce(moveCard, 300), [dashboardTasks]);

    return <>
      {dashboardTasks.map((task, index) => {
        return <CardItem
          id={task.id}
          key={task.id}
          index={index}
          task={task}
          moveCard={moveColumn}
        />
      })}
    </>;
  }

  return <>
    <Modal
      visible={props.visible}
      title={props.title}
      width={props.width}
      onOk={async () => {
        return props.onSubmit(dashboardTasks);
      }}
      onCancel={() => {
        props.onVisibleChange(false);
        if (props.onCancel) {
          props.onCancel();
        }
      }}
    >
      <Row gutter={24}>
        <DndProvider backend={HTML5Backend}>
          <CardList/>
        </DndProvider>
      </Row>
    </Modal>
  </>
}
export default SortForm;
