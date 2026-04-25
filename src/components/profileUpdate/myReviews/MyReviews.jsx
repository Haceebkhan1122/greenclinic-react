import React, { useEffect, useState } from 'react'
import { Row, Col, Form } from "react-bootstrap"
import { StarFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import Plus from "../../../assets/images/png/plus_icon.png"
import { review } from '../../../services/data/indexReview';
import "./myReviews.scss";
import { API_MS } from '../../../services/httpInstance';
import Loader from '../../loader/Loader';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/fontawesome-free-solid';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { isMobile } from 'react-device-detect';

const MyReviews = ({ detailsDoctor }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [consultType, setConsultType] = useState("")
  const [selectedRating, setSelectedRating] = useState("")
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState("1");
  const [paginateCountData, setPaginateCountData] = useState(null);
  const [reviewsData, setReviewsData] = useState([])
  const [userId, setUserId] = useState(null);
  const [perPage, setPerPage] = useState(1);
  const [first, setFirst] = useState(0);

  useEffect(() => {
    setUserId(detailsDoctor?.user?.id)
  }, [detailsDoctor])

  const handleChange = (e) => {
    const { value, name, checked } = e.target;
    if (name == "consultType") {
      setConsultType(value);
    }
    if (name == "ratingSelect") {
      setSelectedRating(value);
    }
  }

  const onPageChange = (event) => {
    const nextPage = event?.page + 1;
    setCurrentPage(nextPage);
  };

  const getReviewsFn = async (pageNumber) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      if (selectedRating) queryParams.append("rating", selectedRating);
      if (consultType) queryParams.append("type", consultType);
      if (userId) queryParams.append("gc_user_id", userId);
      queryParams.append("page", pageNumber)
      const queryString = decodeURIComponent(queryParams.toString());
      const url = queryString ? `/dr-reviews?${queryString}` : `/dr-reviews`;
      const response = await API_MS.get(url);
      if (response?.status === 200 && response?.data?.data) {
        setReviewsData(response.data.data);
        setCurrentPage(response?.data?.data?.currentPage);
        setTotalPages(Math.ceil(response?.data?.data?.total / response?.data?.data?.perPage));
        setPerPage(response?.data?.data?.perPage);
      } else {
        console.warn("Unexpected API response:", response);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getReviewsFn(currentPage);
  }, [userId, selectedRating, consultType, currentPage])

  return (
    <>
      {isLoading ? <Loader />
        :
        (<>
          <div className='review-profile'>
            {!isMobile ? <Row className="align-items-center">
              <Form.Group as={Col} lg={3} md={6} sm={6}>
                <Form.Select name='ratingSelect' value={selectedRating} onChange={handleChange}>
                  <option value="select-rating">Select Rating</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} lg={3} md={6} sm={6}>
                <Form.Select name='consultType' value={consultType} onChange={handleChange}>
                  <option value="" hidden>Select Consult Type</option>
                  <option value="in-person">In Person</option>
                  <option value="scheduled"> Scheduled </option>
                </Form.Select>
              </Form.Group>
              <Col lg={4}></Col>
              <Col lg={2} className='text-end'>
                <a href="javascript:void(0);" className='rate-reivew'><StarFilled /> {reviewsData?.average} ({reviewsData?.listing?.length} {reviewsData?.listing?.length == 1 ? "Review" : "Reviews"})</a>
              </Col>
            </Row>
              :
              <div className="tw-gap-3 tw-flex tw-items-center">
                <Form.Select name='ratingSelect' onChange={handleChange}>
                  <option value="select-rating">Select Rating</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </Form.Select>
                <Form.Select name='consultType' onChange={handleChange}>
                  <option value="">Select Consult Type</option>
                  <option value="in-person">In Person</option>
                  <option value="scheduled"> Scheduled </option>
                </Form.Select>
              </div>
            }
            <div className="box">
              {reviewsData && reviewsData?.listing?.map((reviews, idx) => (
                <div className="cards" key={idx}>
                  <div className='d-flex align-items-center justify-content-between'>
                    <h4>{reviews?.name} <span className='line'>|</span> <span className='rate'><StarFilled /> {reviews?.rating}</span></h4>
                    <p className='in-person'>{reviews?.type} <img src={Plus} alt="" /></p>
                  </div>
                  <p>{reviews?.description}</p>
                  <h5>{reviews?.date}</h5>
                </div>
              ))}
            </div>
          </div>
          {/* <ReactPaginate
            onPageChange={handlePageChange}
            pageCount={totalPages}
            previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
            nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
            pageRangeDisplayed={0}
            marginPagesDisplayed={0}
            containerClassName="pagination_reviews"
            previousClassName="prev_item"
            nextClassName="next_item"
            previousLinkClassName="previousLink"
            nextLinkClassName="medical_next_link"
            forcePage={currentPage - 1}
            renderOnZeroPageCount={null}
            activeClassName={'active'}
          />   */}
          <Paginator
            first={(currentPage - 1) * perPage}
            rows={perPage}
            totalRecords={totalPages}
            onPageChange={onPageChange}
            template="PrevPageLink PageLinks NextPageLink"
          />
        </>)
      }
    </>
  )
}

export default MyReviews