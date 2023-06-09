import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { CourseRequest, CourseResponse } from 'apps/blockchain-frontend/interfaces/viewModels';
import { createCourse, getCourse } from 'apps/blockchain-frontend/api/fetchData';
import { DefaultPagination } from 'apps/blockchain-frontend/interfaces/enums';

export function useComponentState() {
  const [dataSource, setDataSource] = useState([]);
 

  const createNewCourse = async (values) => {
    let course: CourseRequest = {
      Title: values.title,
      Description: values.description,
      StartDate: values.startDate,
      EndDate: values.endDate,
    };
    const courseRes = await createCourse(course);
  };

  const validate = (values) => {
    const errors: {
      title?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
    } = {};

    if (!values.title) {
      errors.title = 'Required';
    } else if (values.title.length > 50) {
      errors.title = 'Must be 50 characters or less';
    }

    if (!values.startDate) {
      errors.startDate = 'Required';
    }

    if (!values.endDate) {
      errors.endDate = 'Required';
    } else if (values.endDate < values.startDate) {
      errors.endDate = 'End date must be later than start date';
    }

    if (values.description.length > 300) {
      errors.description = 'Must be 300 characters or less';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      startDate: '',
      endDate: '',
      description: '',
    },
    validate,
    onSubmit: createNewCourse,
  });

  const fetchCourses = async (pageNumber: number, pageSize: number) => {
    let courseRes: CourseResponse[] = [await getCourse(pageNumber, pageSize)];
    if (Array.isArray(courseRes)) {
      courseRes = courseRes.flat();
    }
    const formattedData = courseRes.map((item) => {
      const formattedStartDate = new Date(item.StartDate).toLocaleDateString();
      const formattedEndDate = new Date(item.EndDate).toLocaleDateString();
      return { ...item, StartDate: formattedStartDate, EndDate: formattedEndDate, key: item.Id };
    });
    setDataSource(formattedData);
  };

  useEffect(() => {
    fetchCourses(DefaultPagination.pageNumber, DefaultPagination.pageSize);
  }, []);
  return { formik, dataSource, fetchCourses };
}
