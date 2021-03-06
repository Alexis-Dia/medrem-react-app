import { takeEvery, call, put } from "redux-saga/effects";
import { loginApi } from "./loginApi";
import { loginAsync } from "./loginActions";
import { Response, SuccessResponse } from "../../types/api";
import { HttpStatus } from "../../types/common/HttpStatus";
import { UserErrors } from "./types";

function * tryLogin(action: ReturnType<typeof loginAsync.request>): Generator {
    const response = <Response> (yield call(loginApi, action.payload));
    if (typeof response === "undefined") {
        yield put(loginAsync.failure((action.payload.errors as UserErrors).serverIsUnreachable));
    } else if (response.httpStatus === HttpStatus.OK) {
        yield put(loginAsync.success(response as SuccessResponse));
    } else {
        yield put(loginAsync.failure((action.payload.errors as UserErrors).invalidCredentials));
    }
}

export function * login() {
    yield takeEvery(loginAsync.request, tryLogin);
}


