import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

actor {
  type Message = {
    sender : Text;
    content : Text;
  };

  module Message {
    public func compare(message1 : Message, message2 : Message) : Order.Order {
      Text.compare(message1.content, message2.content);
    };
  };

  var assistantName = "Z Assistant";
  let messages = List.empty<Message>();

  public shared ({ caller }) func updateAssistantName(newName : Text) : async () {
    if (newName.size() == 0) { Runtime.trap("Name cannot be empty") };
    assistantName := newName;
  };

  public query ({ caller }) func getAssistantName() : async Text {
    assistantName;
  };

  public shared ({ caller }) func addUserMessage(content : Text) : async Message {
    let userMessage : Message = {
      sender = "User";
      content;
    };
    messages.add(userMessage);
    let response = generateAssistantResponse(content);
    messages.add(response);
    response;
  };

  public query ({ caller }) func getMessages() : async [Message] {
    messages.toArray().sort();
  };

  func generateAssistantResponse(userInput : Text) : Message {
    let lowerInput = userInput.toLower();
    let reply = if (lowerInput.contains(#text "hello") or lowerInput.contains(#text "hi")) {
      "Hello! How can I assist you today?";
    } else if (lowerInput.contains(#text "help")) {
      "I'm here to help with any questions you have. Just type your query!";
    } else {
      "I'm not sure I understand. Could you please rephrase?";
    };
    {
      sender = assistantName;
      content = reply;
    };
  };
};
