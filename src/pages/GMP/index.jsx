import React, { useState, useCallback, useEffect, useMemo } from "react";
import Table from "../../Components/common/table";
import PageHeader from "../../Components/common/pageHeader";
import Modal from "../../Components/common/Modal";
import Button from "../../Components/common/Button";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { CiEdit } from "react-icons/ci";
import { Form, Input, Select } from "antd";
import { toast } from "react-toastify";
import useFirebaseContext from "../../hooks/firebase";
import { AiOutlineDelete } from "react-icons/ai";

function GmpScreen() {
  const [gmpData, setGmpData] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const { addDocument, updateDocument, deleteDocument } = useFirebaseContext();
  const [form] = Form.useForm();

  const [filter, setFilter] = useState({
    type: "SME",
  });

  const handleDeleteGmp = async (id) => {
    try {
      setLoading(true);
      await deleteDocument("gmp", id);
      toast.success("News Deleted Successful");
      setIsModalOpen(false);
      getAllGmpData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGmpData = useCallback((initialData, data) => {
    data.forEach((item, ind) => {
      initialData.push({
        col1: ind + 1,
        col2: item.name,
        col3: item.symbol,
        col4: item.type,
        col5: item.percentage,
        col6: item.value,
        col7: (
          <div className="flex align-items--center justify-content--center gap--15">
            <CiEdit
              style={{ height: 22, width: 22 }}
              onClick={() => {
                form.setFieldsValue(item);
                setUpdateId(item.id);
                setIsModalOpen(true);
              }}
            />
            <AiOutlineDelete
              style={{ height: 22, width: 22 }}
              onClick={() => handleDeleteGmp(item.id)}
            />
          </div>
        ),
      });
    });
    return initialData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(
    () =>
      handleGmpData(
        [],
        gmpData.filter((i) => i.type === filter.type)
      ),
    [filter.type, gmpData, handleGmpData]
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
        Header: "symbol",
        accessor: "col3",
      },
      {
        Header: "type",
        accessor: "col4",
      },
      {
        Header: "percentage",
        accessor: "col5",
      },
      {
        Header: "value",
        accessor: "col6",
      },

      {
        Header: "action7",
        accessor: "col7",
      },
    ],
    []
  );

  const getAllGmpData = useCallback(async () => {
    setIsFetchingData(true);
    try {
      await getDocs(collection(db, "gmp")).then((querySnapshot) => {
        const GMP_DATA = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setGmpData(GMP_DATA);
        setIsFetchingData(false);
      });
    } catch (error) {
      console.log(error.message);
      setIsFetchingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllGmpData();
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
        await addDocument("gmp", { ...values, id: values.symbol });
      } else {
        await updateDocument("gmp", updateId, values);
      }
      toast.success(`GMP ${updateId ? "Updated" : "Added"} Successful`);
      getAllGmpData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      handleCloseModal();
    }
  };

  const handleFilterData = (value) => {
    setFilter((prev) => ({ ...prev, type: value }));
  };
  return (
    <div className="page-wrapper">
      <Modal
        isVisible={isModalOpen}
        title={"Add Grey Market Premium"}
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
            label="Symbol"
            name="symbol"
            rules={[{ required: true, message: "Symbol is required" }]}
          >
            <Input type="text" placeholder="Symbol of Ipo" />
          </Form.Item>
          <Form.Item
            label="Percentage"
            name="percentage"
            rules={[
              {
                required: true,
                message: "Percentage is required",
              },
            ]}
          >
            <Input type="number" placeholder="Enter Percentage" />
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
            <Input type="number" placeholder="Value of Ipo" />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            rules={[
              {
                required: true,
                message: "Type is required",
              },
            ]}
          >
            <Select placeholder="Select the type ">
              <Select.Option value="SME">SME</Select.Option>
              <Select.Option value="IPO">IPO</Select.Option>
            </Select>
          </Form.Item>
          <Button
            type="submit"
            className="full-width"
            loading={isLoading}
            style={{ marginTop: 50 }}
          >
            {updateId ? "Update GMP" : "Add GMP"}
          </Button>
        </Form>
      </Modal>
      <div className={"data-list-section"}>
        <PageHeader
          title="Grey Market Premium"
          isAddBtn={true}
          handleAdd={() => {
            setIsModalOpen(true);
          }}
        />

        <div className="flex flex--column gap--20 table-container mt--page">
          <div className="flex justify-content--end gap--20">
            <Select
              placeholder="Select the type"
              value={filter.type}
              onSelect={handleFilterData}
            >
              <Select.Option value="SME">SME</Select.Option>
              <Select.Option value="IPO">IPO</Select.Option>
            </Select>
          </div>
          <Table
            columns={columns}
            data={data}
            loading={isFetchingData}
            tableTitle={"GMP Summery"}
          />
        </div>
      </div>
    </div>
  );
}

export default GmpScreen;
