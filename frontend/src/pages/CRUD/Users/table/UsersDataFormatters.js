import moment from 'moment';
import React from 'react';
import Box from '@mui/material/Box';
import { truncate } from 'lodash';

function imageFormatter(cell) {
  const images = cell?.image;
  const imageUrl = images && images.length ? images[0].publicUrl : undefined;

  if (!imageUrl) return null;

  return (
    <Box
      component='img'
      sx={{
        height: 45,
        width: 45,
        borderRadius: '50%',
      }}
      alt='avatar'
      src={imageUrl}
    />
  );
}

function booleanFormatter(cell) {
  return cell ? 'Yes' : 'No';
}

function dateTimeFormatter(cell) {
  return cell ? moment(cell).format('YYYY-MM-DD HH:mm') : null;
}

function filesFormatter(cell) {
  return (
    <div>
      {cell &&
        cell.map((value) => {
          return (
            <div key={value.id}>
              <i className='la la-link text-muted mr-2'></i>
              <a
                href={value.publicUrl}
                target='_blank'
                rel='noopener noreferrer'
                download
              >
                {truncate(value.name)}
              </a>
            </div>
          );
        })}
    </div>
  );
}

function listFormatter(cell, history, entity) {
  if (!cell) return null;

  const getContent = (id, title) => (
    <div key={id}>
      <a
        href='#'
        onClick={(e) => {
          e.preventDefault();
          history.push(`/admin/${entity}/${id}/edit`);
        }}
      >
        {title}
      </a>
    </div>
  );

  return (
    <div>
      {cell &&
        cell.length &&
        cell.map((value) => getContent(value.id, value.firstName))}
      {cell && getContent(cell.id, cell.firstName)}
    </div>
  );
}

export {
  booleanFormatter,
  imageFormatter,
  dateTimeFormatter,
  listFormatter,
  filesFormatter,
};
