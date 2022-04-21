import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/scrollbar";

import "./swiperStyles.css";

import { Scrollbar, Mousewheel } from "swiper";

export default function AppSwiper({ appData, handleQuery }) {
  // console.log("Swiper", appData);
  return (
    <>
      <Swiper
        style={{ maxWidth: 650 }}
        slidesPerView={3}
        spaceBetween={30}
        mousewheel={true}
        scrollbar={{
          hide: true,
        }}
        modules={[Scrollbar, Mousewheel]}
        className="mySwiper"
      >
        {appData.map((e, i) => {
          return (
              <SwiperSlide
                key={i}
                style={{ height: 80, backgroundColor: "lightgreen" }}
                onClick={()=>handleQuery(e.App_Acronym)}
              >
                {e.App_Acronym}
              </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
