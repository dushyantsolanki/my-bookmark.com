/**
 * Yup validation schemas for bookmark forms.
 */

import * as Yup from 'yup';

export const BookmarkSchema = Yup.object().shape({
  title: Yup.string().min(1, 'Title is required').required('Title is required'),
  url: Yup.string().url('Must be a valid URL').required('URL is required'),
});
