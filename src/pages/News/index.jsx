import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  Fragment,
} from "react";
import Table from "../../Components/common/table";
import PageHeader from "../../Components/common/pageHeader";
import Modal from "../../Components/common/Modal";
import Button from "../../Components/common/Button";
import { db } from "../../firebase";
import { Timestamp, collection, getDocs } from "firebase/firestore";
import { calculateTimeRemaining } from "../../utils/common";
import { CiEdit } from "react-icons/ci";
import { HiMiniEye } from "react-icons/hi2";
import { Form, Input } from "antd";
import style from "./news.module.scss";
import { IoCloseOutline, IoTimeOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import useFirebaseContext from "../../hooks/firebase";
import { AiOutlineDelete } from "react-icons/ai";

function News() {
  const [newsData, setNewsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [newsDetails, setNewsDetails] = useState({
    isModalOpen: false,
    data: null,
  });
  const [updateId, setUpdateId] = useState(null);

  const [isLoading, setLoading] = useState(false);
  const { addDocument, updateDocument, deleteDocument } = useFirebaseContext();
  const [form] = Form.useForm();

  const handleDeleteNews = async (id) => {
    try {
      setLoading(true);
      await deleteDocument("news", id);
      toast.success("News Deleted Successful");
      setIsModalOpen(false);
      getAllNews();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleNewsData = useCallback((initialData, data) => {
    data.forEach((item, ind) => {
      initialData.push({
        col1: ind + 1,
        col2: (
          <img src={item.imageUrl} alt="" style={{ height: 35, width: 70 }} />
        ),
        col3: item.title.slice(0, 20) + "...",
        col4: item.description.slice(0, 20) + "...",

        col5: calculateTimeRemaining(item.createdAt.toDate()),
        col6: (
          <div className="flex align-items--center justify-content--center gap--15">
            <CiEdit
              style={{ height: 22, width: 22 }}
              onClick={() => {
                const details = {};
                item.details.forEach((d, i) => {
                  details[`details[${i}].title`] = d.title;
                  details[`details[${i}].description`] = d.description;
                });
                form.setFieldsValue({
                  title: item.title,
                  description: item.description,
                  imageUrl: item.imageUrl,
                  url: item.url,
                  ...details,
                });
                setUpdateId(item.id);
                setDetailsFields(item.details);
                setIsModalOpen(true);
              }}
            />
            <HiMiniEye
              style={{ height: 22, width: 22 }}
              onClick={() => {
                setNewsDetails({
                  isModalOpen: true,
                  data: item,
                });
              }}
            />
            <AiOutlineDelete
              style={{ height: 22, width: 22 }}
              onClick={() => handleDeleteNews(item.id)}
            />
          </div>
        ),
      });
    });
    return initialData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(() => newsData, [newsData]);
  const columns = React.useMemo(
    () => [
      {
        Header: "Sr.no",
        accessor: "col1",
      },
      {
        Header: "image",
        accessor: "col2",
      },
      {
        Header: "title",
        accessor: "col3",
      },
      {
        Header: "description",
        accessor: "col4",
      },
      {
        Header: "createdAt",
        accessor: "col5",
      },
      {
        Header: "actions",
        accessor: "col6",
      },
    ],
    []
  );

  const getAllNews = useCallback(async () => {
    setIsFetchingData(true);
    try {
      await getDocs(collection(db, "news")).then((querySnapshot) => {
        const NEWS_DATA = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const data = handleNewsData([], NEWS_DATA);
        setNewsData(data);
        setIsFetchingData(false);
      });
    } catch (error) {
      console.log(error.message);
      setIsFetchingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    form.resetFields(); // This will reset all fields in the form
    setDetailsFields([{ title: "", description: "" }]);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const data = {
        createdAt: Timestamp.fromDate(new Date()),
        title: values.title,
        description: values.description,
        imageUrl: values.imageUrl,
        url: values.url,
        details: detailsFields,
      };
      if (!updateId) {
        await addDocument("news", data);
      } else {
        await updateDocument("news", updateId, data);
      }

      toast.success(`News ${updateId ? "Updated" : "Added"} Successful`);
      setIsModalOpen(false);
      getAllNews();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const [detailsFields, setDetailsFields] = useState([
    { title: "", description: "" },
  ]);

  const handleDetailFieldChange = (e, index, fieldName) => {
    const newDetails = [...detailsFields];
    newDetails[index][fieldName] = e.target.value;
    setDetailsFields(newDetails);
  };
  return (
    <div className="page-wrapper">
      <Modal
        isVisible={isModalOpen}
        title={"Add News"}
        onClose={() => {
          setIsModalOpen(false);
          setLoading(false);
          setUpdateId(null);
          handleReset();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt--10"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "title is required" }]}
          >
            <Input type="text" placeholder="Title of News" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "description is required" }]}
          >
            <Input.TextArea type="text" placeholder="Description of News" />
          </Form.Item>

          <Form.Item
            label="Image Url"
            name="imageUrl"
            rules={[
              {
                required: true,
                message: "Image Url is required",
              },
            ]}
          >
            <Input type="url" placeholder="Add reward" />
          </Form.Item>
          <Form.Item label="News Url" name="url">
            <Input type="url" placeholder="Enter News Url" />
          </Form.Item>
          <div className="flex align-items--center justify-content--between mb--20">
            <h2>More Details</h2>
            <strong
              className={"font-size--12 pointer"}
              onClick={() => {
                setDetailsFields((prev) => [
                  ...prev,
                  { title: "", description: "" },
                ]);
              }}
            >
              Add More Fields
            </strong>
          </div>
          {detailsFields.map((data, index) => (
            <div key={index} className={style.detailFieldsContainer}>
              {index > 0 && (
                <IoCloseOutline
                  onClick={() => {
                    const newFields = detailsFields.filter(
                      (_, i) => i !== index
                    );
                    setDetailsFields(newFields);
                  }}
                />
              )}
              <Form.Item
                label="Title"
                name={`details[${index}].title`}
                rules={[
                  {
                    required: true,
                    message: "Title is required",
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Enter Title"
                  onChange={(e) => handleDetailFieldChange(e, index, "title")}
                  value={data.title}
                />
              </Form.Item>
              <Form.Item
                label="Description"
                name={`details[${index}].description`}
                rules={[
                  {
                    required: true,
                    message: "Description is required",
                  },
                ]}
              >
                <Input.TextArea
                  type="text"
                  placeholder="Enter Description"
                  onChange={(e) =>
                    handleDetailFieldChange(e, index, "description")
                  }
                  value={data.description}
                />
              </Form.Item>
            </div>
          ))}
          <Button
            type="submit"
            className="full-width mt--20"
            loading={isLoading}
          >
            {updateId ? "Update News" : "Add News"}
          </Button>
        </Form>
      </Modal>
      <Modal
        isVisible={newsDetails.isModalOpen}
        title={"News Details"}
        onClose={() => {
          setNewsDetails({
            isModalOpen: false,
            data: null,
          });
        }}
      >
        {newsDetails.data && (
          <div className={style["details-container"]}>
            <img src={newsDetails.data.imageUrl} alt="" />
            <div className="flex align-items--center">
              <IoTimeOutline />
              <span style={{ margin: "2px 0 0 5px" }}>
                {calculateTimeRemaining(newsDetails.data.createdAt.toDate())}
              </span>
            </div>
            <p>{newsDetails.data.title}</p>
            <span>{newsDetails.data.description}</span>
            {newsDetails.data.details.map((item) => (
              <Fragment>
                <p>{item.title}</p>
                <span>{item.description}</span>
              </Fragment>
            ))}
          </div>
        )}
      </Modal>
      <div className={"data-list-section"}>
        <PageHeader
          title="News"
          isAddBtn={true}
          handleAdd={() => {
            setIsModalOpen(true);
          }}
        />
        <div className="table-container mt--page">
          <Table
            columns={columns}
            data={data}
            loading={isFetchingData}
            tableTitle={"News Summery"}
          />
        </div>
      </div>
    </div>
  );
}

export default News;
