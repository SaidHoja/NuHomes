<div><span class="loader inline-block"></span></div>

<style>
	div {
		@apply w-11;
	}
	.loader {
		@apply w-3;
		@apply h-3;
		position: relative;
		border-radius: 50%;
		@apply text-costar-orange;
		@apply left-4;
		animation: fill 1s ease-in infinite alternate;
	}
	.loader::before,
	.loader::after {
		content: '';
		position: absolute;
		height: 100%;
		width: 100%;
		border-radius: 50%;
		left: 16px;
		top: 0;
		animation: fill 0.9s ease-in infinite alternate;
	}

	.loader::after {
		left: auto;
		right: 16px;
		animation-duration: 1.1s;
	}

	@keyframes fill {
		0% {
			box-shadow: 0 0 0 2px inset;
		}
		100% {
			box-shadow: 0 0 0 10px inset;
		}
	}
</style>
