let stompClient = null;

document.getElementById("connect").addEventListener("click", () => {
  const url = document.getElementById("url").value;

  const socket = new SockJS(url);
  stompClient = Stomp.over(socket);
  stompClient.debug = null;
  stompClient.connect({}, () => {
    appendChat("✅ STOMP 연결 성공");
  }, (err) => {
    appendChat("❌ 연결 실패: " + err);
  });
});

document.getElementById("subscribeBtn").addEventListener("click", () => {
  const topic = document.getElementById("subscribe").value;

  if (stompClient && stompClient.connected) {
    stompClient.subscribe(topic, (msg) => {
      try {
        const chat = msg.body;
        appendChat(chat);
      } catch (e) {
        appendChat("⚠️ 메시지 파싱 실패: " + msg.body);
      }
    });
    appendChat("📡 토픽 구독됨: " + topic);
  } else {
    appendChat("⚠️ STOMP에 먼저 연결해주세요.");
  }
});

document.getElementById("sendBtn").addEventListener("click", () => {
  const rawJson = document.getElementById("message").value;
  const endpoint = document.getElementById("send").value;

  try {
    const parsedMsg = JSON.parse(rawJson);

    if (stompClient && stompClient.connected) {
      stompClient.send(endpoint, {}, JSON.stringify(parsedMsg));
    } else {
      appendChat("⚠️ STOMP 연결이 필요합니다.");
    }
  } catch (e) {
    appendChat("❌ JSON 오류: " + e.message);
  }
});

function appendChat(text) {
  const chat = document.getElementById("chat");
  chat.innerText += text + '\n';
  chat.scrollTop = chat.scrollHeight;
}
