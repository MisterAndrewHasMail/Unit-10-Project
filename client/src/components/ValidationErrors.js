import React from 'react'

// Functional component ValidationErrors receiving errors prop
const ValidationErrors = ({ errors }) => {
	// If errors array is empty, return null (component doesn't render anything)
	if (errors.length === 0) {
		return null
	}

	// Render validation errors if errors array is not empty
	return (
		<div className='validation--errors'>
			<h3>Validation Errors</h3>
			<ul>
				{errors.map((error, index) => (
					<li key={index}>{error}</li> // Map through errors array to display each error in a list item
				))}
			</ul>
		</div>
	)
}

export default ValidationErrors // Export ValidationErrors component
