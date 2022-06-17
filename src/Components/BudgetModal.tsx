import { Modal, Button, Form, InputNumber, Switch } from "antd";

const BudgetModal = (props) => {
  const { budget, showBudget } = props;

  const [budgetForm] = Form.useForm();

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <>
      <Modal
        visible={props.showModal}
        title="Set Budget"
        onOk={() => {
          props.setBudget(budgetForm.getFieldValue("budget"));
          props.setShowBudget(budgetForm.getFieldValue("show"));
          props.setShowModal(false);
        }}
        onCancel={() => props.setShowModal(false)}
        destroyOnClose
      >
        <Form
          layout="horizontal"
          initialValues={{ budget: budget, show: showBudget }}
          form={budgetForm}
          {...formItemLayout}
        >
          <Form.Item name="show" label="Display" valuePropName="checked">
            <Switch style={{ textAlign: "right" }} />
          </Form.Item>

          <Form.Item name="budget" label="Budget">
            <InputNumber precision={2} formatter={(value) => `$ ${value}`} />
          </Form.Item>
        </Form>
      </Modal>
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          margin: "50px 175px",
          zIndex: 20,
        }}
      >
        <Button type="primary" onClick={() => props.setShowModal(true)}>
          Budget
        </Button>
      </div>
    </>
  );
};

export default BudgetModal;
