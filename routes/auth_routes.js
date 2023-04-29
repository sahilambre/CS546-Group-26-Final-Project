import { Router } from "express";
const router = Router();
import bcrypt from "bcryptjs";
import * as recreq from "../data/recruiters.js";

router.route("/").get(async (req, res) => {
  res.render("landingpage");
});

router
  .route("/registerrecruiter")
  .get(async (req, res) => {
    res.render("recruiterregister");
  })
  .post(async (req, res) => {
    const data = req.body;
    const result = recreq.create(
      data.firstName,
      data.lastName,
      data.company,
      data.email,
      data.jobListing
    );
    res.render("regsuccess");
  });

router.route("/registeruser").get(async (req, res) => {
  res.render("studentregister");
});

router.route("/login").get(async (req, res) => {
  res.render("login");
});
