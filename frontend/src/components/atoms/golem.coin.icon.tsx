import { ComponentProps } from 'react'

export const GolemCoinIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g filter="url(#filter0_bi_1472_11883)">
        <circle cx="12" cy="12" r="12" fill="#F6F8FC" />
        <circle cx="12" cy="12" r="11.25" stroke="#181EA9" strokeWidth="1.5" />
      </g>
      <path
        d="M14.5279 5.41992L13.1929 6.78895C12.7402 6.45808 12.1871 6.26194 11.5896 6.26194C10.0626 6.26194 8.81934 7.53686 8.81934 9.105C8.81934 10.5107 9.81935 11.6816 11.1273 11.9075V12.9357C9.81935 13.1616 8.81934 14.3325 8.81934 15.7382C8.81934 17.3053 10.0616 18.5812 11.5896 18.5812C13.1176 18.5812 14.3599 17.3063 14.3599 15.7382C14.3599 14.3325 13.3599 13.1616 12.052 12.9357V11.9075C13.3599 11.6816 14.3599 10.5107 14.3599 9.105C14.3599 8.49181 14.1688 7.92419 13.8464 7.4596L15.1804 6.08958L14.5279 5.41992ZM13.4362 15.7382C13.4362 16.7832 12.608 17.6332 11.5896 17.6332C10.5713 17.6332 9.74309 16.7832 9.74309 15.7382C9.74309 14.6931 10.5713 13.8431 11.5896 13.8431C12.608 13.8431 13.4362 14.6931 13.4362 15.7382ZM11.5896 11C10.5713 11 9.74309 10.1501 9.74309 9.105C9.74309 8.05991 10.5713 7.20996 11.5896 7.20996C12.608 7.20996 13.4362 8.05991 13.4362 9.105C13.4362 10.1501 12.608 11 11.5896 11Z"
        fill="#181EA9"
      />
      <defs>
        <filter
          id="filter0_bi_1472_11883"
          x="-400"
          y="-400"
          width="824"
          height="824"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="200" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_1472_11883"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_1472_11883"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-8" dy="-3" />
          <feGaussianBlur stdDeviation="16.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0941176 0 0 0 0 0.117647 0 0 0 0 0.662745 0 0 0 0.04 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect2_innerShadow_1472_11883"
          />
        </filter>
      </defs>
    </svg>
  )
}
