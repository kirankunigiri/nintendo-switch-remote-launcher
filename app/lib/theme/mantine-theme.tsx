import { createTheme, Modal } from '@mantine/core';

// Theme config
export const theme = createTheme({
	cursorType: 'pointer', // adds pointer cursor for checkbox
	focusClassName: 'focus-auto',
	fontFamily: 'Inter, sans-serif',
	components: {
		Modal: Modal.extend({
			defaultProps: {
				transitionProps: { transition: 'pop', duration: 150 },
			},
		}),
	},
});
