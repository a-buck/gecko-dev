/* -*- Mode: c++; c-basic-offset: 2; indent-tabs-mode: nil; tab-width: 40 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef mozilla_ipc_BluetoothDaemonConnectionConsumer_h
#define mozilla_ipc_BluetoothDaemonConnectionConsumer_h

#include "mozilla/Attributes.h"
#include "mozilla/FileUtils.h"
#include "mozilla/ipc/ConnectionOrientedSocket.h"
#include "nsAutoPtr.h"

namespace mozilla {
namespace ipc {

/*
 * |BluetoothDaemonConnectionConsumer| handles socket events.
 */
class BluetoothDaemonConnectionConsumer
{
public:
  /**
   * Callback for socket success. Main-thread only.
   *
   * @param aIndex The index that has been given to the stream socket.
   */
  virtual void OnConnectSuccess(int aIndex) = 0;

  /**
   * Callback for socket errors. Main-thread only.
   *
   * @param aIndex The index that has been given to the stream socket.
   */
  virtual void OnConnectError(int aIndex) = 0;

  /**
   * Callback for socket disconnect. Main-thread only.
   *
   * @param aIndex The index that has been given to the stream socket.
   */
  virtual void OnDisconnect(int aIndex) = 0;

protected:
  BluetoothDaemonConnectionConsumer();
  virtual ~BluetoothDaemonConnectionConsumer();
};

}
}

#endif

