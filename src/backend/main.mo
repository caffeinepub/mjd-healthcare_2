import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";

actor {
  type ContactForm = {
    name : Text;
    email : Text;
    company : Text;
    message : Text;
    timestamp : Int;
  };

  module ContactForm {
    public func compare(form1 : ContactForm, form2 : ContactForm) : Order.Order {
      Int.compare(form1.timestamp, form2.timestamp);
    };
  };

  let admins = Map.empty<Principal, ()>();

  let inquiries = Map.empty<Nat, ContactForm>();

  func isAdmin(caller : Principal) : Bool {
    admins.containsKey(caller);
  };

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, company : Text, message : Text) : async () {
    let inquiry : ContactForm = {
      name;
      email;
      company;
      message;
      timestamp = Time.now();
    };
    inquiries.add(inquiries.size(), inquiry);
  };

  public query ({ caller }) func listInquiries() : async [ContactForm] {
    if (not isAdmin(caller)) {
      Runtime.trap("Only admins can list inquiries");
    };
    inquiries.values().toArray().sort();
  };
};
