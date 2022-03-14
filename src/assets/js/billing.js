$(document).ready(function () {

  var bank = `
  <div class="col-4 bank-account__setup">
    <div class="bank-account text-white">
      <div class="mt-2 mb-2 px-2">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="remove__bank">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-trash" viewBox="0 0 16 16">
              <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
              <path fill-rule="evenodd"
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
            </svg>
          </span>
        </div>
        <div class="d-flex">
          <div class="d-flex flex-column align-items-center pr-3 border-right border-dark-light">
            <svg id="Capa_1" fill="#fff" enable-background="new 0 0 512 512" height="40" width="40"
              viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path
                  d="m478.5 241.992c6.893 0 12.5-5.607 12.5-12.5v-22.5h8.5c6.893 0 12.5-5.607 12.5-12.5v-29c0-6.893-5.607-12.5-12.5-12.5h-8.5v-12.789c0-6.285-3.396-12.117-8.861-15.219l-215.004-122.051c-6.869-3.9-15.401-3.899-22.269-.001l-144.351 81.944c-3.602 2.045-4.865 6.623-2.82 10.225 2.044 3.603 6.623 4.863 10.225 2.82l144.352-81.945c2.3-1.305 5.157-1.306 7.458.001l215.005 122.053c.781.443 1.266 1.276 1.266 2.174v12.789h-5.383l-208.447-118.329c-3.808-2.16-8.537-2.16-12.342 0l-208.446 118.328h-5.383v-12.789c0-.897.485-1.73 1.266-2.174l40.229-22.837c3.602-2.045 4.865-6.623 2.82-10.225-2.045-3.603-6.624-4.862-10.225-2.82l-40.228 22.837c-5.466 3.102-8.862 8.934-8.862 15.219v12.789h-8.5c-6.893 0-12.5 5.607-12.5 12.5v29c0 6.893 5.607 12.5 12.5 12.5h8.5v22.5c0 6.893 5.607 12.5 12.5 12.5h23.127v132.906c-4.595 1.849-7.851 6.345-7.851 11.594v25 23.5h-15.276c-6.893 0-12.5 5.607-12.5 12.5v18.5h-8.5c-6.893 0-12.5 5.607-12.5 12.5v26c0 4.143 3.358 7.5 7.5 7.5h497c4.142 0 7.5-3.357 7.5-7.5v-26c0-6.893-5.607-12.5-12.5-12.5h-8.5v-18.5c0-6.893-5.607-12.5-12.5-12.5h-15.276v-23.5-25c0-5.115-3.091-9.516-7.5-11.449v-133.051zm-2.5-15h-121.219c2.344-6.516 4.02-13.217 5.035-20h116.184zm-27.776 162v15h-45v-15zm-52.5-13.949c-4.409 1.933-7.5 6.335-7.5 11.449v17.5h-25.351v-17.5c0-4.976-2.93-9.27-7.149-11.28v-133.22h40zm-92.851 28.949v-15h45v15zm-78.746 0v-17.5c0-5.115-3.091-9.516-7.5-11.449v-86.19c12.693 5.138 25.975 7.62 39.136 7.62 13.724 0 27.313-2.695 39.96-7.859v86.283c-4.595 1.849-7.851 6.345-7.851 11.594v17.5h-63.745zm-60 0v-15h45v15zm-40.351 0v-17.5c0-4.976-2.93-9.27-7.149-11.28v-133.22h40v133.051c-4.409 1.933-7.5 6.335-7.5 11.449v17.5zm-60 0v-15h45v15zm137.851-30h-30v-119.881c8.025 10.825 18.153 20.07 30 27.229zm139.097-120.536v120.536h-30v-92.944c11.468-6.987 21.718-16.252 30-27.592zm156.276-61.464h-136.024c.042-8.041-.837-16.095-2.646-24h138.67zm-241-143.583 184.232 104.583h-86.54c-.886-2.254-1.843-4.488-2.891-6.694-1.778-3.74-6.25-5.333-9.993-3.556-3.741 1.777-5.333 6.252-3.556 9.993 12.748 26.831 11.475 58.179-3.406 83.855-24.892 42.946-80.064 57.658-122.989 32.79-20.624-11.944-35.469-31.318-41.822-54.701-6.178-23.229-2.939-47.48 9.119-68.286 24.892-42.946 80.063-57.658 122.989-32.79 7 4.056 13.398 9.003 19.018 14.704 2.907 2.95 7.656 2.983 10.606.077 2.95-2.908 2.984-7.657.076-10.606-6.56-6.655-14.022-12.427-22.181-17.153-50.08-29.015-114.447-11.855-143.485 38.247-2.652 4.575-4.937 9.294-6.853 14.12h-86.556zm-241 119.583h138.641c-1.82 7.866-2.712 15.911-2.664 24h-135.977zm21 39h116.148c.582 3.862 1.373 7.714 2.391 11.543.764 2.872 1.648 5.69 2.635 8.457h-121.174zm65.627 35v132h-30v-132zm395.373 255h-482v-16h482zm-99.042-62c-4.142 0-7.5 3.357-7.5 7.5s3.358 7.5 7.5 7.5h78.042v16h-440v-16h326.724c4.142 0 7.5-3.357 7.5-7.5s-3.358-7.5-7.5-7.5h-298.948v-16h384.447v16zm42.766-61h-30v-132h30z" />
                <path
                  d="m290.777 126.314c-36.093-19.156-81.096-5.383-100.319 30.709-15.979 30.003-9.59 66.872 15.539 89.657 3.069 2.784 7.812 2.55 10.594-.518s2.55-7.812-.518-10.594c-20.032-18.164-25.121-47.564-12.375-71.495 15.34-28.801 51.25-39.797 80.047-24.51 13.938 7.397 24.154 19.779 28.766 34.864 4.617 15.103 3.067 31.105-4.366 45.062-12.93 24.276-41.523 36.605-67.979 29.316-3.994-1.101-8.123 1.245-9.223 5.238s1.245 8.123 5.238 9.223c31.173 9.311 69.935-6.342 85.203-36.727 9.318-17.495 11.261-37.561 5.471-56.498-5.784-18.919-18.597-34.448-36.078-43.727z" />
                <path
                  d="m255.608 210.893c-5.154.035-6.373-.157-10.146-2.622-3.468-2.265-8.115-1.29-10.38 2.178-2.266 3.468-1.291 8.115 2.177 10.381 4.23 2.763 7.544 4.068 11.242 4.647v2.074c0 4.143 3.358 7.5 7.5 7.5s7.5-3.357 7.5-7.5v-3.077c8.01-2.975 13.133-10.226 14.337-17.403 1.709-10.187-3.814-19.386-13.744-22.89-1.888-.666-3.59-1.173-5.092-1.619-4.114-1.224-5.607-1.73-6.994-3.381-.34-.404-.751-1.683-.406-3.387.179-.885.831-3.062 3.006-4.173 3.143-1.605 6.795 1.287 7.201 1.623 3.195 2.636 7.921 2.186 10.558-1.01 2.637-3.194 2.185-7.922-1.009-10.559-2.162-1.785-4.858-3.37-7.858-4.388v-1.71c0-4.143-3.358-7.5-7.5-7.5s-7.5 3.357-7.5 7.5v2.36c-5.001 2.213-10.162 7.899-11.6 14.878-1.197 5.903.157 11.891 3.621 16.014 4.352 5.182 9.36 6.671 14.204 8.111 1.397.415 2.843.845 4.375 1.386 3.897 1.375 4.295 4.165 3.943 6.263-.504 3.016-3.047 6.274-7.435 6.304z" />
              </g>
            </svg>
            <div class="badge rounded-pill bg-white text-dark mt-3">
              Primary
            </div>
          </div>
          <div class="pl-3 w-100">
            <div>
              <div class="h5 text-white mb-2">US Bank</div>
              <div class="small mb-2">0000 0000 0000 0002</div>
              <div class="d-flex justify-content-between align-items-end mt-n2">
                <div class="small">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                    class="bi bi-check-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path
                      d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                  </svg>
                  Approved
                </div>
                <div class="toggleEditBank float-right">
                  <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor"
                    class="bi bi-three-dots" viewBox="0 0 16 6">
                    <path
                      d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  `;

  var credit = `
  <div class="col-4 credit-card__setup">
    <div class="credit-card">
      <div class="mt-2 mb-3 px-2">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <span class="remove__card">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-trash" viewBox="0 0 16 16">
              <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
              <path fill-rule="evenodd"
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
            </svg>
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" class="text-white" fill="#ffffff" width="50" height="18"
            viewBox="0 0 21 6">
            <path
              d="M18.51 5.991s-.148-.792-.196-1l-2.06-.002c-.062.161-.338 1.002-.338 1.002h-1.689L16.616.494c.169-.387.457-.493.842-.493h1.243l1.301 5.99H18.51zm-.83-3.854l-.109-.512c-.081.223-.222.583-.213.567 0 0-.508 1.203-.641 1.545h1.335c-.064-.298-.372-1.6-.372-1.6zm-3.604-.661a2.936 2.936 0 0 0-1.203-.227c-.63 0-.921.264-.921.511-.004.278.34.461.902.736.928.424 1.357.846 1.351 1.521-.013 1.232-1.11 1.982-2.801 1.982-.721-.007-1.416-.151-1.791-.317l.225-1.329.208.094c.528.222.87.312 1.514.312.462 0 .958-.135.962-.533.003-.26-.208-.446-.834-.737-.61-.284-1.418-.668-1.409-1.521.01-1.154 1.129-1.959 2.718-1.959a4.13 4.13 0 0 1 1.441.249l-.218 1.287-.144-.069zM6.998 5.988L8.003.003h1.609L8.606 5.988H6.998zm-3.879.003L1.685.781c.869.478 1.527 1.115 1.948 1.855l.069.129c.038.072.069.147.103.221.037.088.075.176.102.264l.167.823L5.649 0h1.704L4.821 5.989l-1.702.002zm.514-3.355A4.849 4.849 0 0 0 1.679.759l.006.022A6.79 6.79 0 0 0 0 .128L.02.004h2.594c.349.013.631.125.729.501l.564 2.698c-.029-.074-.069-.145-.102-.217a3.645 3.645 0 0 0-.103-.221c-.023-.043-.045-.087-.069-.129z"
              fill-rule="evenodd"></path>
          </svg>
        </div>
        <div class="card-number d-flex justify-content-between align-items-center font-weight-bolder">
          <span>****</span>
          <span>****</span>
          <span>****</span>
          <span>0009</span>
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-end mb-2 px-2">
        <div class="d-flex align-items-center">
          <div class="d-flex flex-column small">
            <div>expire</div>
            <div>10/25</div>
          </div>
          <div class="d-flex flex-column small pl-4">
            <div>cvv</div>
            <div>447</div>
          </div>
        </div>
        <div class="toggleEdit">
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor"
            class="bi bi-three-dots" viewBox="0 0 16 6">
            <path
              d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
  `;

  // remove
  $('.remove__card').each(function (index, element) {
    $(this).click(function (e) {
      e.preventDefault();
      $('.credit-card__setup').hide();
    });
  });
  $('.remove__bank').each(function (index, element) {
    $(this).click(function (e) {
      e.preventDefault();
      $('.bank-account__setup').hide();
    });
  });
  // remove

  // append
  $('.add-account__credit').click(function (e) {
    e.preventDefault();
    $('.credit-form__add').show();
    $('.bank-form__add').hide();
  });
  $('.add-account__bank').click(function (e) {
    e.preventDefault();
    $('.bank-form__add').show();
    $('.credit-form__add').hide();
  });
  // section 2
  $('.bank-form__append').click(function (e) {
    e.preventDefault();
    $('.bank-form__add').hide();
    $('.bank-account__setup').show();
    // $('#appendMethod').html(bank);
  });
  $('.credit-form__append').click(function (e) {
    e.preventDefault();
    $('.credit-form__add').hide();
    $('.credit-card__setup').show();
    // $('#appendMethod').html(credit);
  });
  // append

  // edit
  var show = false;
  $('.toggleEdit').each(function (index, element) {
    $(this).click(function (e) {
      e.preventDefault();
      if (show) {
        $('.credit-form__edit').hide();
        show = false;
      } else {
        $('.credit-form__edit').show();
        $('.bank-form__edit').hide();
        show = true;
      }
    });
  });

  var seen = false;
  $('.toggleEditBank').each(function (index, element) {
    $(this).click(function (e) {
      e.preventDefault();
      if (seen) {
        $('.bank-form__edit').hide();
        seen = false;
      } else {
        $('.bank-form__edit').show();
        $('.credit-form__edit').hide();
        seen = true;
      }
    });
  });
  // edit

  // submit btn toggle
  $('.credit-form__submit').click(function (e) {
    e.preventDefault();
    $('.credit-form__edit').hide();
    show = false;
  });
  $('.bank-form__submit').click(function (e) {
    e.preventDefault();
    $('.bank-form__edit').hide();
    seen = false;
  });
  // submit btn toggle

});
