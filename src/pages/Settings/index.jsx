import React, { useState, useCallback, useEffect, useMemo } from "react";
import Table from "../../Components/common/table";
import PageHeader from "../../Components/common/pageHeader";
import Modal from "../../Components/common/Modal";
import Button from "../../Components/common/Button";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { CiEdit } from "react-icons/ci";
import { Form, Input } from "antd";
import { toast } from "react-toastify";
import useFirebaseContext from "../../hooks/firebase";

function Setting() {
  const [settingData, setSettingData] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const { addDocument, updateDocument } = useFirebaseContext();
  const [form] = Form.useForm();

  const handleSettingData = useCallback((initialData, data) => {
    data.forEach((item, ind) => {
      initialData.push({
        col1: ind + 1,
        col2: item.name,
        col3: item.value,
        col4: (
          <div className="flex align-items--center justify-content--center gap--15">
            <CiEdit
              style={{ height: 22, width: 22 }}
              onClick={() => {
                form.setFieldsValue(item);
                setUpdateId(item.id);
                setIsModalOpen(true);
              }}
            />
          </div>
        ),
      });
    });
    return initialData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(
    () => handleSettingData([], settingData),
    [settingData, handleSettingData]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Sr.no",
        accessor: "col1",
      },
      {
        Header: "name",
        accessor: "col2",
      },
      {
        Header: "value",
        accessor: "col3",
      },
      {
        Header: "action7",
        accessor: "col4",
      },
    ],
    []
  );

  const getAllSettingData = useCallback(async () => {
    setIsFetchingData(true);
    try {
      await getDocs(collection(db, "settings")).then((querySnapshot) => {
        const SETTING_DATA = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setSettingData(SETTING_DATA);
        setIsFetchingData(false);
      });
    } catch (error) {
      console.log(error.message);
      setIsFetchingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllSettingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    form.resetFields(); // This will reset all fields in the form
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setLoading(false);
    setUpdateId(null);
    handleReset();
  };

  const handleSubmit = async (values) => {
    try {
      if (!updateId) {
        await addDocument("settings", values);
      } else {
        await updateDocument("settings", updateId, values);
      }
      toast.success(`Settings ${updateId ? "Updated" : "Added"} Successful`);
      getAllSettingData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div className="page-wrapper">
      <Modal
        isVisible={isModalOpen}
        title={"Settings"}
        onClose={handleCloseModal}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt--10"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input type="text" placeholder="Enter Name of Ipo" />
          </Form.Item>
          <Form.Item
            label="Value"
            name="value"
            rules={[
              {
                required: true,
                message: "Value is required",
              },
            ]}
          >
            <Input type="text" placeholder="Enter Value" />
          </Form.Item>
          <Button
            type="submit"
            className="full-width"
            loading={isLoading}
            style={{ marginTop: 50 }}
          >
            {updateId ? "Update Setting" : "Add Setting"}
          </Button>
        </Form>
      </Modal>
      <div className={"data-list-section"}>
        <PageHeader
          title="Settings"
          isAddBtn={true}
          handleAdd={() => {
            setIsModalOpen(true);
          }}
        />
        <div className="flex flex--column gap--20 table-container mt--page">
          <Table
            columns={columns}
            data={data}
            loading={isFetchingData}
            tableTitle={"Settings Summery"}
          />
        </div>
      </div>
    </div>
  );
}

export default Setting;
