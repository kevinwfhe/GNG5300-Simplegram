export {}
// /* eslint-disable import/no-extraneous-dependencies */
// import React from 'react';
// import '../../../__test__/utils/matchMedia.mock';
// import { render, fireEvent } from 'test-utils';
// import '@testing-library/jest-dom';
// import { TopBar } from '../..';

// const mockTopBarProps = {
//   title: 'Mock Title',
//   subtitle: 'Mock Subtitle',
//   showSubtitle: false,
// };

// test('Change theme color', () => {
//   const { getByRole } = render(<TopBar {...mockTopBarProps} />);

//   const initCheckedButton = getByRole('button', { pressed: true });
//   expect(initCheckedButton).toHaveTextContent('Light');

//   const initUncheckedButton = getByRole('button', { pressed: false });
//   expect(initUncheckedButton).toHaveTextContent('Dark');

//   fireEvent.click(initUncheckedButton);

//   const checkedButton = getByRole('button', { pressed: true });
//   expect(checkedButton).toHaveTextContent('Dark');

//   const uncheckedButton = getByRole('button', { pressed: false });
//   expect(uncheckedButton).toHaveTextContent('Light');
// });
